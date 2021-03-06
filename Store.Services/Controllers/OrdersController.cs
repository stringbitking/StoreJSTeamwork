﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Store.Data;
using Store.Models;
using Store.Services.Models;
using System.Web.Http.ValueProviders;
using Store.Services.Attributes;

namespace Store.Services.Controllers
{
    public class OrdersController : BaseApiController
    {
        // GET orders/all
        [HttpGet]
        [ActionName("all")]
        public IQueryable<OrderModel> GetAll(
            [ValueProvider(typeof(HeaderValueProviderFactory<string>))] string sessionKey)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                ValidateLoggedUserIsAdmin(sessionKey);

                var context = new StoreContext();

                var models = GetAllAsOrderModels(context);

                return models.OrderByDescending(o => o.OrderDate);
            });

            return responseMsg;
        }

        [HttpGet]
        [ActionName("adminOrders")]
        public IEnumerable<OrderDetailsModel> GetAdminOrders([ValueProvider(typeof(HeaderValueProviderFactory<string>))]string sessionKey)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                bool isAdmin = ValidateLoggedUserIsAdmin(sessionKey);

                var context = new StoreContext();
                using (context)
                {
                    if (isAdmin)
                    {

                        var user = context.Users.FirstOrDefault(us => us.SessionKey == sessionKey);

                        var myOrders = context.Orders;

                        var models = (from orderEntity in myOrders
                                      select new OrderDetailsModel()
                                      {
                                          Id = orderEntity.Id,
                                          OrderDate = orderEntity.OrderDate,
                                          Status = orderEntity.Status,
                                          User = new UserModel()
                                          {
                                              Id = orderEntity.User.Id,
                                              username = orderEntity.User.Username
                                          },
                                          ProductRecords = (from record in orderEntity.ProductRecords
                                                            select new ProductOrderModel()
                                                            {
                                                                Id = record.Id,
                                                                Quantity = record.Quantity,
                                                                Product = new ProductModel()
                                                                {
                                                                    Id = record.Product.Id,
                                                                    Info = record.Product.Info,
                                                                    IsDeleted = record.Product.IsDeleted,
                                                                    Name = record.Product.Name,
                                                                    Price = record.Product.Price,
                                                                    Quantity = record.Product.Quantity
                                                                }
                                                            })
                                      });

                        return models.ToList();
                    }
                    else
                    {
                        throw new ArgumentException("Not admin!");
                    }
                }
            });

            return responseMsg;
        }

        // GET orders/myOrders
        [HttpGet]
        [ActionName("myOrders")]
        public IEnumerable<OrderDetailsModel> GetMyOrders([ValueProvider(typeof(HeaderValueProviderFactory<string>))]string sessionKey)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                bool isAdmin = ValidateLoggedUserIsAdmin(sessionKey);

                var context = new StoreContext();
                using (context)
                {
                    var user = context.Users.FirstOrDefault(us => us.SessionKey == sessionKey);

                    var myOrders = context.Orders.Where(o => o.User.Id == user.Id);

                    var models = (from orderEntity in myOrders
                                  select new OrderDetailsModel()
                                  {
                                      Id = orderEntity.Id,
                                      OrderDate = orderEntity.OrderDate,
                                      Status = orderEntity.Status,
                                      User = new UserModel()
                                      {
                                          Id = orderEntity.User.Id,
                                          username = orderEntity.User.Username
                                      },
                                      ProductRecords = (from record in orderEntity.ProductRecords
                                                        select new ProductOrderModel()
                                                        {
                                                            Id = record.Id,
                                                            Quantity = record.Quantity,
                                                            Product = new ProductModel()
                                                            {
                                                                Id = record.Product.Id,
                                                                Info = record.Product.Info,
                                                                IsDeleted = record.Product.IsDeleted,
                                                                Name = record.Product.Name,
                                                                Price = record.Product.Price,
                                                                Quantity = record.Product.Quantity
                                                            }
                                                        })
                                  });

                    return models.ToList();
                }
            });

            return responseMsg;
        }

        // GET orders/single/orderId
        [HttpGet]
        [ActionName("single")]
        public OrderDetailsModel GetOrder(
            [ValueProvider(typeof(HeaderValueProviderFactory<string>))]
            string sessionKey, int orderId)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                bool isAdmin = ValidateLoggedUserIsAdmin(sessionKey);

                var context = new StoreContext();
                using (context)
                {
                    if (isAdmin)
                    {
                        OrderDetailsModel model = GetOrderDetails(context, orderId);

                        return model;
                    }
                        // else if -> Verify ownership
                    else
                    {
                        throw new ArgumentException("User doesn't have permissions to view orders.");
                    }
                }
            });

            return responseMsg;
        }

        // POST orders/create
        [HttpPost]
        [ActionName("create")]
        public HttpResponseMessage PostOrder(
            [ValueProvider(typeof(HeaderValueProviderFactory<string>))]
            string sessionKey, [FromBody]OrderCreateModel model)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                bool isAdmin = ValidateLoggedUserIsAdmin(sessionKey);

                var context = new StoreContext();
                using (context)
                {
                    var user = context.Users.FirstOrDefault(us => us.SessionKey == sessionKey);

                    var orderEntity = new Orders()
                    {
                        OrderDate = DateTime.Now,
                        Status = Status.Ordered,
                        User = user
                    };

                    context.Orders.Add(orderEntity);
                    context.SaveChanges();

                    foreach (ProductSampleModel productRecord in model.ProductList)
                    {
                        var product = context.Products.FirstOrDefault(p => p.Id == productRecord.Id);
                        var productOrder = new ProductOrder()
                        {
                            Quantity = productRecord.Quantity,
                            Product = product
                        };

                        orderEntity.ProductRecords.Add(productOrder);
                    }

                    context.SaveChanges();

                    var response = this.Request.CreateResponse(HttpStatusCode.Created, model);
                    return response;
                }
            });

            return responseMsg;
        }

        // PUT orders/approve/orderId
        [HttpPut]
        [ActionName("approve")]
        public HttpResponseMessage PutApproveOrder(int orderId, 
            [ValueProvider(typeof(HeaderValueProviderFactory<string>))]
            string sessionKey)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                bool isAdmin = ValidateLoggedUserIsAdmin(sessionKey);

                var context = new StoreContext();
                using (context)
                {
                    if (isAdmin)
                    {
                        var orderEntity = context.Orders.FirstOrDefault(o => o.Id == orderId);
                        orderEntity.Status = Status.Pending;
                        context.SaveChanges();

                        return this.Request.CreateResponse(HttpStatusCode.OK);
                    }
                    else
                    {
                        throw new ArgumentException("User doesn't have permissions to view orders.");
                    }
                }
            });

            return responseMsg;
        }

        // PUT orders/reject/orderId
        [HttpPut]
        [ActionName("reject")]
        public HttpResponseMessage PutRejectOrder(int orderId, 
            [ValueProvider(typeof(HeaderValueProviderFactory<string>))]
            string sessionKey)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                bool isAdmin = ValidateLoggedUserIsAdmin(sessionKey);

                var context = new StoreContext();
                using (context)
                {
                    if (isAdmin)
                    {
                        var orderEntity = context.Orders.FirstOrDefault(o => o.Id == orderId);
                        orderEntity.Status = Status.Rejected;
                        context.SaveChanges();

                        return this.Request.CreateResponse(HttpStatusCode.OK);
                    }
                    else
                    {
                        throw new ArgumentException("User doesn't have permissions to view orders.");
                    }
                }
            });

            return responseMsg;
        }

        // PUT orders/send/orderId
        [HttpPut]
        [ActionName("send")]
        public HttpResponseMessage PutSendOrder(int orderId, 
            [ValueProvider(typeof(HeaderValueProviderFactory<string>))]
            string sessionKey)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                bool isAdmin = ValidateLoggedUserIsAdmin(sessionKey);

                var context = new StoreContext();
                using (context)
                {
                    if (isAdmin)
                    {
                        var orderEntity = context.Orders.FirstOrDefault(o => o.Id == orderId);
                        orderEntity.Status = Status.Sent;
                        context.SaveChanges();

                        return this.Request.CreateResponse(HttpStatusCode.OK);
                    }
                    else
                    {
                        throw new ArgumentException("User doesn't have permissions to view orders.");
                    }
                }
            });

            return responseMsg;
        }

        /* Private methods */

        private OrderDetailsModel GetOrderDetails(StoreContext context, int orderId)
        {
            var orderEntity = context.Orders.FirstOrDefault(o => o.Id == orderId);

            OrderDetailsModel model = new OrderDetailsModel()
            {
                Id = orderEntity.Id,
                OrderDate = orderEntity.OrderDate,
                Status = orderEntity.Status,
                User = new UserModel()
                {
                    Id = orderEntity.User.Id,
                    username = orderEntity.User.Username
                },
                ProductRecords = (from record in orderEntity.ProductRecords
                                  select new ProductOrderModel()
                                  {
                                      Id = record.Id,
                                      Quantity = record.Quantity,
                                      Product = new ProductModel()
                                      {
                                          Id = record.Product.Id,
                                          Info = record.Product.Info,
                                          IsDeleted = record.Product.IsDeleted,
                                          Name = record.Product.Name,
                                          Price = record.Product.Price,
                                          Quantity = record.Product.Quantity
                                      }
                                  }).ToList()
            };

            return model;
        }

        private static bool ValidateLoggedUserIsAdmin(string sessionKey)
        {
            if (sessionKey.Length != 50)
            {
                throw new ArgumentException("Invalid session key.");
            }

            using (var context = new StoreContext())
            {
                User user = context.Users.FirstOrDefault(us => us.SessionKey == sessionKey);

                if (user == null)
                {
                    throw new ArgumentException("Invalide session key.");
                }
                else
                {
                    return user.IsAdmin;
                }
            }
        }

        private IQueryable<OrderModel> GetAllAsOrderModels(StoreContext context)
        {
            var orderEntities = context.Orders;
            var models = (from order in orderEntities
                          select new OrderModel()
                          {
                             Id = order.Id,
                             Status = order.Status,
                             OrderDate = order.OrderDate
                          });

            return models;
        }
    }
}

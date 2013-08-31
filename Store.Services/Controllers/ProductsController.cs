using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Store.Data;
using Store.Models;
using Store.Services.Models;

namespace Store.Services.Controllers
{
    public class ProductsController : BaseApiController
    {
        // GET products/all
        [HttpGet]
        [ActionName("all")]
        public IQueryable<ProductModel> GetAll([FromUri]string sessionKey)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                ValidateLoggedUserIsAdmin(sessionKey);

                var context = new StoreContext();

                var models = GetAllAsProductModels(context);

                return models.OrderBy(p => p.Price);
            });

            return responseMsg;
        }

        // GET products/category/id
        [HttpGet]
        [ActionName("category")]
        public IEnumerable<ProductModel> GetByCategory(int id, [FromUri]string sessionKey)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                ValidateLoggedUserIsAdmin(sessionKey);

                var context = new StoreContext();
                using(context)
                {
                    var productEntities = context.Products.Where(p => p.Categories.Any(c => c.Id == id));
                    var productModels = (from entity in productEntities
                                         select new ProductModel()
                                         {
                                             Id = entity.Id,
                                             Name = entity.Name,
                                             Price = entity.Price,
                                             Info = entity.Info,
                                             IsDeleted = entity.IsDeleted,
                                             Quantity = entity.Quantity
                                         });

                    return productModels.ToList();
                }
            });

            return responseMsg;
        }

        // GET products/category/categoryId?page=&count=
        [HttpGet]
        [ActionName("category")]
        public IEnumerable<ProductModel> GetByCategory(int id, [FromUri]int page, [FromUri]int count, [FromUri]string sessionKey)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                ValidateLoggedUserIsAdmin(sessionKey);

                var models = this.GetByCategory(id, sessionKey);

                return models.Skip(page * count).Take(count);
            });

            return responseMsg;
        }

        // GET products/all?page=&count=
        [HttpGet]
        [ActionName("all")]
        public IEnumerable<ProductModel> GetAllByPage([FromUri]int page, [FromUri]int count, [FromUri]string sessionKey)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                ValidateLoggedUserIsAdmin(sessionKey);

                var models = this.GetAll(sessionKey);

                return models.Skip(page*count).Take(count).ToList();
            });

            return responseMsg;
        }

        // GET products/single/productId
        [HttpGet]
        [ActionName("single")]
        public ProductModel GetByProductId(int id, [FromUri]string sessionKey)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                ValidateLoggedUserIsAdmin(sessionKey);

                var context = new StoreContext();
                using (context)
                {
                    var productEntity = context.Products.FirstOrDefault(p => p.Id == id);
                    var productModel = new ProductModel()
                                         {
                                             Id = productEntity.Id,
                                             Name = productEntity.Name,
                                             Price = productEntity.Price,
                                             Info = productEntity.Info,
                                             IsDeleted = productEntity.IsDeleted,
                                             Quantity = productEntity.Quantity
                                         };

                    return productModel;
                }
            });

            return responseMsg;
        }

        // POST products/create
        [HttpPost]
        [ActionName("create")]
        public HttpResponseMessage PostProduct([FromUri]string sessionKey, [FromBody]ProductModel model)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                ValidateLoggedUserIsAdmin(sessionKey);

                var context = new StoreContext();
                using (context)
                {
                    var entity = new Product()
                    {
                        Name = model.Name,
                        Price = model.Price,
                        Info = model.Info,
                        IsDeleted = model.IsDeleted,
                        Quantity = model.Quantity
                    };

                    context.Products.Add(entity);
                    context.SaveChanges();

                    var response = this.Request.CreateResponse(HttpStatusCode.Created, model);
                    return response;
                }
            });

            return responseMsg;
        }

        // PUT product/update/productId
        [HttpPut]
        [ActionName("update")]
        public HttpResponseMessage PutProduct(int id, [FromUri]string sessionKey, [FromBody]ProductModel model)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                ValidateLoggedUserIsAdmin(sessionKey);

                var context = new StoreContext();
                using (context)
                {
                    var entity = context.Products.FirstOrDefault(p => p.Id == id);
                    entity.Name = model.Name;
                    entity.Price = model.Price;
                    entity.Info = model.Info;
                    entity.IsDeleted = model.IsDeleted;
                    entity.Quantity = model.Quantity;
                    context.SaveChanges();

                    var response = this.Request.CreateResponse(HttpStatusCode.Created, model);
                    return response;
                }
            });

            return responseMsg;
        }

        /* Private methods */

        private IQueryable<ProductModel> GetAllAsProductModels(StoreContext context)
        {
            var entities = context.Products;
            var models = (from entity in entities
                          select new ProductModel()
                          {
                              Id = entity.Id,
                              Name = entity.Name,
                              Price = entity.Price,
                              Info = entity.Info,
                              IsDeleted = entity.IsDeleted,
                              Quantity = entity.Quantity
                          });

            return models;
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
    }
}

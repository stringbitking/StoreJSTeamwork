using Store.Data;
using Store.Models;
using Store.Services.Attributes;
using Store.Services.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ValueProviders;

namespace Store.Services.Controllers
{
    public class CategoriesController : BaseApiController
    {
        // GET api/categories/user_all          -> CategoryFullModel
        // GET api/categories/admin_all         -> CategoryAdminFullModel
        //===========
        // GET api/categories/user/categoryId       -> CategoryFullModel
        // GET api/categories/admin/categoryId      -> CategoryAdminFullModel
        //===========
        // GET api/categories/user?page=0&count=2
        // GET api/categories/admin?page=0&count=2
        //===========
        // GET api/categories/user?keyword=webapi
        // GET api/categories/admin?keyword=webapi
        //===========
        // POST api/categories/admin_create             -> CategoryAdminBaseModel
        // PUT api/categories/{catId}/admin_update      -> CategoryAdminBaseModel

        // GET api/categories/user_all 
        [HttpGet]
        [ActionName("user_all")]
        public IQueryable<CategoryFullModel> GetAll(
            [ValueProvider(typeof(HeaderValueProviderFactory<string>))]
            string sessionKey)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                var context = new StoreContext();
                var user = context.Users.FirstOrDefault(usr => usr.SessionKey == sessionKey);
                if (user == null)
                {
                    throw new InvalidOperationException("Invalid username or password");
                }

                var catEntities = context.Categories;
                var models =
                    (from catEntity in catEntities
                     where catEntity.IsDeleted == false
                     select new CategoryFullModel()
                     {
                         Id = catEntity.Id,
                         Name = catEntity.Name,
                         Products = (from prodEntity in catEntity.Products
                                     where prodEntity.IsDeleted == false
                                     select new ProductModel()
                                     {
                                         Id = prodEntity.Id,
                                         Name = prodEntity.Name,
                                         Price = prodEntity.Price,
                                         Quantity = prodEntity.Quantity,
                                         Info = prodEntity.Info
                                     }),
                     });
                return models.OrderBy(p => p.Name);
            });

            return responseMsg;
        }

        // GET api/categories/admin_all 
        [HttpGet]
        [ActionName("admin_all")]
        public IQueryable<CategoryAdminFullModel> GetAllAdmin(
            [ValueProvider(typeof(HeaderValueProviderFactory<string>))]
            string sessionKey)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                var context = new StoreContext();

                var user = context.Users.FirstOrDefault(usr => usr.SessionKey == sessionKey);
                if (user == null)
                {
                    throw new InvalidOperationException("Invalid username or password");
                }
                if (!user.IsAdmin)
                {
                    throw new InvalidOperationException("User has no permition for this operation!");
                }

                var catEntities = context.Categories;
                var models =
                    (from catEntity in catEntities
                     select new CategoryAdminFullModel()
                     {
                         Id = catEntity.Id,
                         Name = catEntity.Name,
                         IsDeleted = catEntity.IsDeleted,
                         Products = (from prodEntity in catEntity.Products
                                     select new ProductAdminModel()
                                     {
                                         Id = prodEntity.Id,
                                         Name = prodEntity.Name,
                                         Price = prodEntity.Price,
                                         Quantity = prodEntity.Quantity,
                                         Info = prodEntity.Info,
                                         IsDeleted = prodEntity.IsDeleted
                                     }),
                     });
                return models.OrderBy(p => p.Name);
            });

            return responseMsg;
        }

        //// GET api/categories/user/categoryId 
        [HttpGet]
        [ActionName("user")]
        public CategoryFullModel GetCategory(int id,
            [ValueProvider(typeof(HeaderValueProviderFactory<string>))]
            string sessionKey)
        {
            var models = this.GetAll(sessionKey).FirstOrDefault(x => x.Id == id);
            return models;
        }

        //// GET api/categories/admin/categoryId 
        [HttpGet]
        [ActionName("admin")]
        public CategoryAdminFullModel GetCategoryAdmin(int id,
            [ValueProvider(typeof(HeaderValueProviderFactory<string>))]
            string sessionKey)
        {
            var models = this.GetAllAdmin(sessionKey).FirstOrDefault(x => x.Id == id);
            return models;
        }

        // GET api/categories/user?page=0&count=2
        [HttpGet]
        [ActionName("user")]
        public IQueryable<CategoryFullModel> GetPage(int page, int count, [ValueProvider(typeof(HeaderValueProviderFactory<string>))]
            string sessionKey)
        {
            var models = this.GetAll(sessionKey)
                             .Skip(page * count)
                             .Take(count);
            return models;
        }

        // GET api/categories/admin?page=0&count=2
        [HttpGet]
        [ActionName("admin")]
        public IQueryable<CategoryAdminFullModel> GetPageAdmin(int page, int count, string sessionKey)
        {
            var models = this.GetAllAdmin(sessionKey)
                             .Skip(page * count)
                             .Take(count);
            return models;
        }

        // GET api/categories/user?keyword=webapi
        [HttpGet]
        [ActionName("user")]
        public IQueryable<CategoryFullModel> GetCategoryByKeyword(string keyword,
            [ValueProvider(typeof(HeaderValueProviderFactory<string>))]
            string sessionKey)
        {
            var models = this.GetAll(sessionKey)
                             .Where(p => p.Name == keyword);
            return models;
        }

        // GET api/categories/admin?keyword=webapi
        [HttpGet]
        [ActionName("admin")]
        public IQueryable<CategoryAdminFullModel> GetCategoryByKeywordAdmin(string keyword,
            [ValueProvider(typeof(HeaderValueProviderFactory<string>))]
            string sessionKey)
        {
            var models = this.GetAllAdmin(sessionKey)
                             .Where(p => p.Name == keyword);
            return models;
        }

        // POST api/categories/admin_create  
        [HttpPost]
        [ActionName("admin_create")]
        public HttpResponseMessage PostNewCategory([FromBody]
                                                   CategoryAdminBaseModel value,
            [ValueProvider(typeof(HeaderValueProviderFactory<string>))]
            string sessionKey)
        {
            var responseMsg = this.PerformOperationAndHandleExceptions(() =>
            {
                var context = new StoreContext();
                using (context)
                {
                    var user = context.Users.FirstOrDefault(usr => usr.SessionKey == sessionKey);
                    if (user == null)
                    {
                        throw new InvalidOperationException("Invalid username or password");
                    }
                    if (!user.IsAdmin)
                    {
                        throw new InvalidOperationException("User has no permition for this operation!");
                    }

                    var newCat = new Category
                    {
                        IsDeleted = value.IsDeleted,
                        Name = value.Name
                    };

                    context.Categories.Add(newCat);
                    context.SaveChanges();

                    var returnedModel = new CategoryAdminBaseModel()
                    {
                        Id = newCat.Id,
                        Name = newCat.Name,
                        IsDeleted = newCat.IsDeleted,
                    };

                    var response = this.Request.CreateResponse(HttpStatusCode.Created, returnedModel);

                    return response;
                }
            });

            return responseMsg;
        }

        // PUT api/categories/{catId}/admin_update
        [HttpPut]
        [ActionName("admin_update")]
        public void UpdateCategory(int catId, [FromBody]
                                   CategoryAdminBaseModel value,
            [ValueProvider(typeof(HeaderValueProviderFactory<string>))]
            string sessionKey)
        {
            var context = new StoreContext();
            using (context)
            {
                var user = context.Users.FirstOrDefault(usr => usr.SessionKey == sessionKey);
                if (user == null)
                {
                    throw new InvalidOperationException("Invalid username or password");
                }
                if (!user.IsAdmin)
                {
                    throw new InvalidOperationException("User has no permition for this operation!");
                }
                var cat = context.Categories.FirstOrDefault(c => c.Id == catId);
                if (cat == null)
                {
                    throw new InvalidOperationException("Invalid category Id");
                }

                cat.IsDeleted = value.IsDeleted;

                if (value.Name != null)
                {
                    cat.Name = value.Name;
                }

                context.SaveChanges();
            }
        }
    }
}
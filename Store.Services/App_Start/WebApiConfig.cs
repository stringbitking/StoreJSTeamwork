using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Store.Services
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "CategoriesUpdateApi",
                routeTemplate: "api/categories/{catId}/update",
                defaults: new
                {
                    controller = "categories",
                    action = "update"
                }
            );

            config.Routes.MapHttpRoute(
                name: "CategoriesApi",
                routeTemplate: "api/categories/{action}/{id}",
                defaults: new
                {
                    controller = "categories",
                    id = RouteParameter.Optional
                }
            );

            config.Routes.MapHttpRoute(
                name: "ProductsApi",
                routeTemplate: "api/products/{action}/{id}",
                defaults: new
                {
                    controller = "products",
                    id = RouteParameter.Optional,
                    action = RouteParameter.Optional
                }
            );

            config.Routes.MapHttpRoute(
                name: "OrdersApi",
                routeTemplate: "api/orders/{action}/{orderId}",
                defaults: new
                {
                    controller = "orders",
                    orderId = RouteParameter.Optional,
                    action = RouteParameter.Optional
                }
            );

            config.Routes.MapHttpRoute(
                name: "UsersApi",
                routeTemplate: "api/users/{action}/{userId}",
                defaults: new
                {
                    controller = "users",
                    userId = RouteParameter.Optional
                }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}

namespace Store.Data.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using Store.Models;
    using System.Collections.Generic;

    internal sealed class Configuration : DbMigrationsConfiguration<Store.Data.StoreContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(Store.Data.StoreContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

            var cat1 = new Category { Name = "Terrorism" };
            var cat2 = new Category { Name = "Beverages" };

            context.Products.AddOrUpdate(
                p => p.Name,
                    new Product
                    {
                        Name = "Water",
                        Price = 2.1M,
                        Quantity = 22,
                        Categories = new List<Category> { cat2 }
                    },
                    new Product
                    {
                        Name = "Bomb",
                        Price = 332.1M,
                        Quantity = 2,
                        Categories = new List<Category> { cat2 }
                    },
                    new Product
                    {
                        Name = "Umbrella",
                        Price = 2.31M,
                        Quantity = 12,
                        Categories = new List<Category> { cat1, cat2 }
                    }
                );

            context.Users.AddOrUpdate(us => us.Username,
                new User
                {
                    Username = "admin",
                    AuthCode = "d033e22ae348aeb5660fc2140aec35850c4da997",
                    SessionKey = "d033e22ae348aeb5660fc2140aec35850c4da9971111111111",
                    IsAdmin = true
                }
            );
        }
    }
}

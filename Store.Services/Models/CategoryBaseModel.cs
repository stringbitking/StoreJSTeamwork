using System;
using System.Linq;

namespace Store.Services.Models
{
    public class CategoryBaseModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int ProductsCount { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;

namespace Store.Services.Models
{
    public class CategoryFullModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public IEnumerable<ProductModel> Products { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;

namespace Store.Services.Models
{
    public class CategoryAdminFullModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsDeleted { get; set; }

        public IEnumerable<ProductAdminModel> Products { get; set; }
    }
}
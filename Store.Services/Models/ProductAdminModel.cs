using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Store.Services.Models
{
    public class ProductAdminModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string Info { get; set; }
        public bool IsDeleted { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Store.Services.Models
{
    public class ProductOrderModel
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public virtual ProductModel Product { get; set; }
    }
}

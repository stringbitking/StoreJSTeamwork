using System;
using System.Collections.Generic;
using System.Linq;

namespace Store.Services.Models
{
    public class OrderCreateModel
    {
        public IEnumerable<ProductSampleModel> ProductList { get; set; }
    }
}
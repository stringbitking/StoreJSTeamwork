﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Store.Services.Models
{
    public class ProductCreateModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public bool IsDeleted { get; set; }
        public string Info { get; set; }
        public virtual string Categories { get; set; }
    }
}
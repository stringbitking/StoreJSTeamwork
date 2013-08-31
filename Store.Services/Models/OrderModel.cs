using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Store.Models;

namespace Store.Services.Controllers
{
    public class OrderModel
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public Status Status { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Store.Models;
using Store.Services.Models;

namespace Store.Services.Controllers
{
    public class OrderDetailsModel
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public Status Status { get; set; }
        public virtual UserModel User { get; set; }
        public virtual ICollection<ProductOrderModel> ProductRecords { get; set; }
    }
}

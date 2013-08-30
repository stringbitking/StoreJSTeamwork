using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Store.Models
{
    public enum Status
    {
        Ordered = 0,
        Pending = 1,
        Delivered = 2
    }

    public class Orders
    {
        [Key]
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public Status Status { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<ProductOrder> ProductRecords { get; set; }

        public Orders()
        {
            this.ProductRecords = new HashSet<ProductOrder>();
        }
    }
}

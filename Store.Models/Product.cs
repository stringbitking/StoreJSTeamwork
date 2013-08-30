using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Store.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [MinLength(2), MaxLength(50)]
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }

        public virtual ICollection<Category> Categories { get; set; }

        public Product()
        {
            this.Categories = new HashSet<Category>();
        }
    }
}

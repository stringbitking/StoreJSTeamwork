using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Store.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [MinLength(4), MaxLength(30)]
        public string Username { get; set; }

        [MinLength(40), MaxLength(40)]
        public string AuthCode { get; set; }

        [MinLength(40), MaxLength(50)]
        public string SessionKey { get; set; }
        public bool IsAdmin { get; set; }

        public virtual ICollection<Orders> Orders { get; set; }

        public User()
        {
            this.Orders = new HashSet<Orders>();
        }
    }
}

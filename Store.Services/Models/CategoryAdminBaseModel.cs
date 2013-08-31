using System;
using System.Linq;

namespace Store.Services.Models
{
    public class CategoryAdminBaseModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsDeleted { get; set; }
    }
}
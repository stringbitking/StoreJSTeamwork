﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Store.Services.Controllers
{
    public class UserModel
    {
        public int Id { get; set; }
        public string username { get; set; }
        public string authCode { get; set; }
    }
}

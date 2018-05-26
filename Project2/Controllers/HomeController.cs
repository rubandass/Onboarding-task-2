using Project2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Project2.Controllers
{
    public class HomeController : Controller
    {
        CustomerProductEntities db = new CustomerProductEntities();
        public ActionResult Index()
        {
            return View();
        }
    }
}
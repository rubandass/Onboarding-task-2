using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Project2.Models;

namespace Project2.Controllers
{
    public class CustomersController : Controller
    {
        CustomerProductEntities db = new CustomerProductEntities();
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetCustomerList()
        {
            var customerList = db.Customers.Select(x => new
            {
                Id = x.Id,
                Name = x.Name,
                Address = x.Address
            }).ToList();
            return Json(customerList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerById(int customerId)
        {

            //Customer customer = db.Customers.Find(customerId);
            //var value = JsonConvert.SerializeObject(customer);

            Customer customer = db.Customers.Where(x => x.Id == customerId).SingleOrDefault();
            string value = string.Empty;
            value = JsonConvert.SerializeObject(customer, Formatting.Indented, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });

            return Json(value, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Add(Customer customer)
        {
            var result = false;
            try
            {
                db.Customers.Add(customer);
                db.SaveChanges();
                result = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Update(Customer customer)
        {
            var result = false;
            try
            {
                db.Entry(customer).State = EntityState.Modified;
                db.SaveChanges();
                result = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Delete(int customerId)
        {
            var result = false;
            try
            {
                Customer customer = db.Customers.Find(customerId);
                db.Customers.Remove(customer);
                db.SaveChanges();
                result = true;
            }
            catch (Exception)
            {
                return Json("Error", JsonRequestBehavior.AllowGet);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}
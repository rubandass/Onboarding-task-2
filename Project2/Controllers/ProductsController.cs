using Newtonsoft.Json;
using Project2.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Project2.Controllers
{
    public class ProductsController : Controller
    {
        CustomerProductEntities db = new CustomerProductEntities();

        // GET: Products
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetProductList()
        {
            var productList = db.Products.Select(x => new
            {
                Id = x.Id,
                Name = x.Name,
                Price = x.Price
            }).ToList();
            return Json(productList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProductById(int productId)
        {

            //Product product = db.Products.Find(productId);
            //var value = JsonConvert.SerializeObject(product); //This code doesn't serialize object due to Price is not string.

            Product product = db.Products.Where(x => x.Id == productId).SingleOrDefault();
            string value = string.Empty;
            value = JsonConvert.SerializeObject(product, Formatting.Indented, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });

            return Json(value, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Add(Product product)
        {
            var result = false;
            try
            {
                db.Products.Add(product);
                db.SaveChanges();
                result = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Update(Product product)
        {
            var result = false;
            try
            {
                db.Entry(product).State = EntityState.Modified;
                db.SaveChanges();
                result = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Delete(int productId)
        {
            var result = false;
            try
            {
                Product product = db.Products.Find(productId);
                db.Products.Remove(product);
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
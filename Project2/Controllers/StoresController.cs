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
    public class StoresController : Controller
    {
        CustomerProductEntities db = new CustomerProductEntities();

        // GET: Stores
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetStoreList()
        {
            var storeList = db.Stores.Select(x => new
            {
                Id = x.Id,
                Name = x.Name,
                Address = x.Address
            }).ToList();
            return Json(storeList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetStoreById(int storeId)
        {
            Store store = db.Stores.Where(x => x.Id == storeId).SingleOrDefault();
            string value = string.Empty;
            value = JsonConvert.SerializeObject(store, Formatting.Indented, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });

            return Json(value, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Add(Store store)
        {
            var result = false;
            try
            {
                db.Stores.Add(store);
                db.SaveChanges();
                result = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Update(Store store)
        {
            var result = false;
            try
            {
                db.Entry(store).State = EntityState.Modified;
                db.SaveChanges();
                result = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Delete(int storeId)
        {
            var result = false;
            try
            {
                Store store = db.Stores.Find(storeId);
                db.Stores.Remove(store);
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
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
    public class SalesController : Controller
    {
        CustomerProductEntities db = new CustomerProductEntities();

        // GET: Sales
        public ActionResult Index()
        {
            List<Customer> customerList = db.Customers.ToList();
            ViewBag.ListOfCustomers = new SelectList(customerList, "Id", "Name");

            List<Product> productList = db.Products.ToList();
            ViewBag.ListOfProducts = new SelectList(productList, "Id", "Name");

            List<Store> storeList = db.Stores.ToList();
            ViewBag.ListOfStores = new SelectList(storeList, "Id", "Name");

            //var productSolds = db.Sales.Include(p => p.Customer).Include(p => p.Product).Include(p => p.Store);
            //return View(productSolds.ToList());

            return View();

        }

        
        public JsonResult GetSaleList()
        {
            var saleList = db.Sales.Include(c => c.Customer).Include(p => p.Product).Include(s=>s.Store).Select(x => new
            {
                Id = x.Id,
                ProductId = x.Product.Name,
                CustomerId = x.Customer.Name,
                StoreId = x.Store.Name,
                DateSold = x.DateSold.Day +"-"+ x.DateSold.Month +"-"+ x.DateSold.Year
                

            }).ToList();
            return Json(saleList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSaleById(int saleId)
        {
            Sales sale = db.Sales.Where(x => x.Id == saleId).SingleOrDefault();

            //var ProductSold = db.Sales.Where(x => x.Id == saleId).Select(x => new ProductSoldViewModel // Create new ProductSoldViewModel class and define properties
            //{
            //    Id = saleId,
            //    CustomerId = x.CustomerId,
            //    DateSold = x.DateSold.Day + "- " + x.DateSold.Month + "-" + x.DateSold.Year,
            //    StoreId = x.StoreId,
            //    ProductId = x.ProductId
            //}).FirstOrDefault();

            string value = string.Empty;
            value = JsonConvert.SerializeObject(sale, Formatting.Indented, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });
            return Json(value, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSaleByIdWithName(int saleId)
        {
            var saleList = db.Sales.Where(x => x.Id == saleId).Include(c => c.Customer).Include(p => p.Product).Include(s => s.Store).Select(x => new
            {
                Id = x.Id,
                ProductId = x.Product.Name,
                CustomerId = x.Customer.Name,
                StoreId = x.Store.Name,
                DateSold = x.DateSold.Day + "-" + x.DateSold.Month + "-" + x.DateSold.Year
            }).SingleOrDefault();
            return Json(saleList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Add(Sales sale)
        {
            var result = false;
            try
            {
                db.Sales.Add(sale);
                db.SaveChanges();
                result = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Update(Sales sale)
        {
            var result = false;
            try
            {
                db.Entry(sale).State = EntityState.Modified;
                db.SaveChanges();
                result = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Delete(int saleId)
        {
            Sales sale = db.Sales.Find(saleId);
            db.Sales.Remove(sale);
            return Json(db.SaveChanges(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteProductReference(int Id)
        {
            var result = false;
            var saleList = db.Sales.Where(x => x.ProductId == Id);
            foreach (Sales sale in saleList)
            {
                db.Sales.Remove(sale);
                result = true;
            }
            db.SaveChanges();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteCustomerReference(int Id)
        {
            var result = false;
            var saleList = db.Sales.Where(x => x.CustomerId == Id);
            foreach (Sales sale in saleList)
            {
                db.Sales.Remove(sale);
                result = true;
            }
            db.SaveChanges();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteStoreReference(int Id)
        {
            var result = false;
            var saleList = db.Sales.Where(x => x.StoreId == Id);
            foreach (Sales sale in saleList)
            {
                db.Sales.Remove(sale);
                result = true;
            }
            db.SaveChanges();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}
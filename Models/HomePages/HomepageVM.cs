using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ConsoleMatycom.Models.Components.Sections;

namespace ConsoleMatycom.Models.HomePages
{
    public class HomepageVM
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public List<SectionVM> Content { get; set; }
        public DateTime DatePublish { get; set; }
        public DateTime DateDelete { get; set; }
        public string HeadContent { get; set; }
        public string ScriptContent { get; set; }
        public HomepageVM()
        {
        }
    }
}
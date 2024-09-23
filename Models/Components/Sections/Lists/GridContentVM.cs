using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Lists
{
    public class GridContentVM
    {
        public string Url { get; set; }
        public string UrlMoreInfo { get; set; }
        public string Title { get; set; }


        public GridContentVM() {
            Url = String.Empty;
            UrlMoreInfo ??= String.Empty;
            Title = String.Empty;
        }

    }
}
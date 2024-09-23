using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Lists
{
    public class GridVM
    {
        public string Id { get; set; }
        public GridImageVM Image { get; set; }

        public GridContentVM Content { get; set; }

        public GridVM() { }
    }
}
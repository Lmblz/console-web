using ConsoleMatycom.Models.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Lists
{
    public class GridListVM
    {
        public string _type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }

        public TitleVM Title { get; set; }
        public List<GridVM> Grids { get; set; }

        public GridListVM()
        {
            this._type = "GridList";
            Title = new TitleVM();
            Grids = new List<GridVM>();
        }
    }
}
using ConsoleMatycom.Models.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Lists
{
    public class EntriesListVM
    {
        public string _type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public List<EntryVM> Entries { get; set; }
        public EntriesListVM()
        {
            this._type = "EntriesList";
        }
    }
}
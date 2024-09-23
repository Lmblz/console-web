using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Subsections
{
    public class SubsectionsEntriesVM
    {
        public string _type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }

        public List<SubsectionsEntryVM> Entries { get; set; }

        public SubsectionsEntriesVM()
        {
            this._type = "SubsectionsEntries";
        }
    }
}
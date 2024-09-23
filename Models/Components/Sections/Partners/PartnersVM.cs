using ConsoleMatycom.Models.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Partners
{
    public class PartnersVM
    {
        public string _type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }

        public TitleVM Title { get; set; }

        public List<PartnersItemVM> Items { get; set; }

        public PartnersDescriptionAreaVM DescriptionArea { get; set; }

        public PartnersVM()
        {
            this._type = "Partners";
        }
    }
}
using ConsoleMatycom.Models.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Partners
{
    public class PartnersItemVM
    {
        public string Id { get; set; }
        public PartnersItemLogoVM Logo { get; set; }
        public DescriptionVM Description { get; set; }
        public PartnersItemVM() { }
    }
}
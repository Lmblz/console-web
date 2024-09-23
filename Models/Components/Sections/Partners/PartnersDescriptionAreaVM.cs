using ConsoleMatycom.Models.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Partners
{
    public class PartnersDescriptionAreaVM
    {
        public ButtonVM Button { get; set; }
        public List<DescriptionVM> Descriptions { get; set; }

        public PartnersDescriptionAreaVM()
        {
        }
    }
}
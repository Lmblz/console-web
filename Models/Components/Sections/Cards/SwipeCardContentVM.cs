using ConsoleMatycom.Models.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Cards
{
    public class SwipeCardContentVM
    {
        public string Title { get; set; }

        public string Url { get; set; }
        public DescriptionVM Text { get; set; }

        public ButtonVM Button { get; set; }


    }
}
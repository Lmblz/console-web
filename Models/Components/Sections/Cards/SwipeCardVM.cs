using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Cards
{
    public class SwipeCardVM
    {
        public string Id { get; set; }
        public string SectionId { get; set; }
        public int Position { get; set; }
        public SwipeCardImageVM Image { get; set; }

        public SwipeCardContentVM Content { get; set; }

        public SwipeCardVM() { }
    }
}
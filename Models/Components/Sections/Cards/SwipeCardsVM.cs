using ConsoleMatycom.Models.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Cards
{
    public class SwipeCardsVM
    {
        public string _type { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public TitleVM Title { get; set; }
        public List<SwipeCardVM> Cards { get; set; }
        public SwipeCardsVM()
        {
            this._type = "SwipeCards";
            Title = new TitleVM();
            Cards = new List<SwipeCardVM>();
        }
    }
}
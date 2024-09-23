using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Elements
{
    public class DescriptionVM
    {
        public string Class { get; set; }
        public string Text { get; set; }

        public DescriptionVM()
        {
            Class = string.Empty;
            Text = string.Empty;
        }
    }
}
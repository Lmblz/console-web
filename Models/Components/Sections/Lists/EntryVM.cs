using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Lists
{
    public class EntryVM
    {
        public string Text { get; set; }
        public string Url { get; set; }
        public string EncodedUrl { get; set; }
        public string Class { get; set; } = "button -black -bgtransparent -big";
        public string Script { get; set; }
        public EntryVM() { }
    }
}
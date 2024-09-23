namespace ConsoleMatycom.Models
{
    public class NavigationItem
    {
        public string Title { get; set; }
        public string Class { get; set; }
        public string Url { get; set; }
        public string Id { get; set; }
        public string Root { get; set; }
        public bool IsEncoded { get; set; }
        public int Depth { get; set; }
        public List<NavigationItem> Items { get; set; }

        public NavigationItem()
        {
            Title = string.Empty;
            Class = string.Empty;
            Url = string.Empty;
            Id = string.Empty;
            Root = string.Empty;
            IsEncoded = false;
            Depth = 0;
            Items = new List<NavigationItem>();
        }

    }
}

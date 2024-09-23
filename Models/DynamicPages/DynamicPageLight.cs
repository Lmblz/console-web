namespace ConsoleMatycom.Models.DynamicPages
{
    public class DynamicPageLight
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public int Directory { get; set; }
        public DynamicPageLight()
        {
            Id = String.Empty;
            Title = String.Empty;
            Directory = 0;
        }
    }
}

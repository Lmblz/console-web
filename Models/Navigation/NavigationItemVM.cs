namespace ConsoleMatycom.Models.Navigation
{
    public class NavigationItemVM
    {
        public string Title { get; set; }
        public string Class { get; set; }
        public List<NavigationItemVM> Items { get; set; }
        public string Id { get; set; }
        public string Url { get; set; }
        public bool IsEncoded { get; set; }
        public int Depth { get; set; }
        public string Root {  get; set; }
        public bool NewCol {  get; set; }
        public bool CustomElement { get; set; }
        public string CustomHTML { get; set; }
        public bool HasMerch {  get; set; }
        public NavigationMerchVM MerchContent { get; set; }

        public NavigationItemVM()
        {
            Title = "Nouvel élément";
            Class = string.Empty;
            Items = new List<NavigationItemVM>();
            Id = GetId();
            Url = string.Empty;
            IsEncoded = false;  
            Depth = 0;
            Root = string.Empty;
            NewCol = false;
            CustomElement = false;
            CustomHTML = string.Empty;
            HasMerch = false;
            MerchContent = new NavigationMerchVM();
        }

        private string GetId()
        {
            // Convertir le timestamp en base 36
            string timestampBase36 = DateTime.Now.Ticks.ToString("x");

            // Générer une chaîne aléatoire et la convertir en base 36
            Random random = new Random();
            string randomBase36 = random.Next(0, int.MaxValue).ToString("x").Substring(0, 5);

            // Combiner les deux parties
            return timestampBase36 + randomBase36;
        }
    }
}

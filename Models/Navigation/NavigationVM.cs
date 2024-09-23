namespace ConsoleMatycom.Models.Navigation
{
    public class NavigationVM
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public List<NavigationItemVM> Items { get; set; }
        public DateTime DatePublish { get; set; }
        public DateTime DateDelete { get; set; }
        public NavigationVM() {
            Id = GetId();
            Title = "Nouvelle navigation";
            Items = new List<NavigationItemVM>();
            DatePublish = DateTime.UtcNow;
            DateDelete = new DateTime(2099, 12, 31, 0, 0, 0, DateTimeKind.Utc);
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

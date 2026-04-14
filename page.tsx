import Image from "next/image";
import Link from "next/link";

// Definimos el tipo para Next.js 15+
type Params = Promise<{ slug: string }>;

export default async function Page({ params }: { params: Params }) {
  // 1. IMPORTANTE: Esperar a los params (Fix para Next 15)
  const { slug } = await params;

  const res = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${slug}`
  );

  const data = await res.json();

  if (!data.drinks) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">¡No se encontraron resultados!</h1>
          <Link href="/" className="text-sky-400 hover:text-sky-300 underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header fijo y limpio */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            🍸 Coctelería{" "}
            <span className="text-sky-400">/ {slug}</span>
          </h1>
          <Link
            href="/"
            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-all"
          >
            ← Volver
          </Link>
        </div>
      </header>

      {/* Grid principal - 3 columnas limpias */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.drinks.map((drink: any) => {
            // Extraer ingredientes
            const ingredients = [];
            for (let i = 1; i <= 15; i++) {
              if (drink[`strIngredient${i}`]) {
                ingredients.push(drink[`strIngredient${i}`]);
              }
            }

            return (
              <article
                key={drink.idDrink}
                className="group bg-zinc-900/40 rounded-2xl overflow-hidden border border-white/5 hover:border-sky-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5"
              >
                {/* Imagen - Tamaño fijo y decente */}
                <div className="relative h-64 w-full overflow-hidden bg-zinc-800">
                  <Image
                    src={drink.strDrinkThumb}
                    alt={drink.strDrink}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge de categoría */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-sky-400 border border-white/10">
                    {drink.strCategory || "Cóctel"}
                  </div>
                </div>

                {/* Contenido - Texto legible y bien espaciado */}
                <div className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight line-clamp-1">
                    {drink.strDrink}
                  </h2>

                  {/* Ingredientes */}
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Ingredientes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {ingredients.slice(0, 4).map((ing, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-white/5 px-2 py-1 rounded-md border border-white/5 text-zinc-300"
                        >
                          {ing}
                        </span>
                      ))}
                      {ingredients.length > 4 && (
                        <span className="text-xs bg-sky-500/10 px-2 py-1 rounded-md text-sky-400">
                          +{ingredients.length - 4} más
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Preparación */}
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Preparación
                    </h3>
                    <p className="text-sm text-zinc-300 leading-relaxed line-clamp-3">
                      {drink.strInstructions}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
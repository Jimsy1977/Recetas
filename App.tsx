import React, { useState } from 'react';
import { ChefHat, AlertTriangle, Github } from 'lucide-react';
import UploadZone from './components/UploadZone';
import RecipeDisplay from './components/RecipeDisplay';
import { analyzeImage } from './services/geminiService';
import { RecipeData } from './types';

const App: React.FC = () => {
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Simulated loading steps for UX
  const updateLoadingProgress = () => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setLoadingStep(step);
      if (step > 4) clearInterval(interval);
    }, 1500);
    return interval;
  };

  const handleImageSelected = async (base64: string) => {
    setLoading(true);
    setError(null);
    setImageSrc(base64);
    setLoadingStep(0);
    
    const progressInterval = updateLoadingProgress();

    try {
      const data = await analyzeImage(base64);
      
      clearInterval(progressInterval);

      if (data.error === 'NOT_FOOD') {
        setError("Nuestro chef no reconoce esto como comida. Intenta con una foto clara de un platillo preparado.");
        setRecipeData(null);
      } else if (data.error === 'BLURRY') {
        setError("La foto está un poco borrosa. Necesitamos una toma más clara para identificar los ingredientes.");
        setRecipeData(null);
      } else {
        setRecipeData(data);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError("Algo salió mal en la cocina. Por favor intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setRecipeData(null);
    setImageSrc(null);
    setError(null);
  };

  const loadingMessages = [
    "Escaneando características visuales...",
    "Identificando ingredientes...",
    "Analizando técnicas de cocción...",
    "Calculando perfil nutricional...",
    "Redactando notas del chef...",
    "Finalizando receta..."
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-800">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
            <div className="w-10 h-10 bg-chef-orange rounded-full flex items-center justify-center text-white shadow-md">
              <ChefHat size={24} />
            </div>
            <div>
                <h1 className="font-serif font-bold text-xl tracking-tight leading-none text-stone-900">
                    Recipe Reverse Engineer
                </h1>
                <p className="text-[10px] text-stone-500 font-medium uppercase tracking-widest">
                    Asistente Culinario IA
                </p>
            </div>
          </div>
          
          <a href="#" className="text-stone-400 hover:text-stone-800 transition-colors">
            <Github size={20} />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
            
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r shadow-sm flex items-center gap-3 animate-slide-in">
              <AlertTriangle size={24} />
              <div>
                <p className="font-bold">Error de Análisis</p>
                <p className="text-sm">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="ml-auto text-sm underline hover:text-red-900">Descartar</button>
            </div>
          )}

          {/* Logic Switcher */}
          {!recipeData ? (
             <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-4">
                            Prueba con tus ojos.
                        </h2>
                        <p className="text-stone-500 text-lg">
                            Sube una foto de cualquier platillo. Te diremos cómo cocinarlo.
                        </p>
                    </div>

                    <UploadZone onImageSelected={handleImageSelected} isLoading={loading} />
                    
                    {loading && (
                        <div className="mt-8 max-w-md mx-auto">
                            <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-chef-orange transition-all duration-500 ease-out"
                                    style={{ width: `${Math.min((loadingStep / 5) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-center text-sm font-medium text-stone-500 mt-2 animate-pulse">
                                {loadingMessages[Math.min(loadingStep, loadingMessages.length - 1)]}
                            </p>
                        </div>
                    )}
                </div>
             </div>
          ) : (
             <RecipeDisplay data={recipeData} imageSrc={imageSrc!} onReset={resetApp} />
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 mt-auto no-print">
        <div className="max-w-6xl mx-auto px-4 text-center text-stone-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Recipe Reverse Engineer. Potenciado por Gemini AI.</p>
            <p className="mt-1 text-xs">Los valores nutricionales son estimaciones de IA. Consulta a un profesional para consejos médicos.</p>
        </div>
      </footer>

    </div>
  );
};

export default App;
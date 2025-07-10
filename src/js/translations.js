/**
 * Translation files for 8-Puzzle Solver
 * Contains Turkish and English translations for all UI elements
 */

window.Translations = {
    // Turkish translations
    tr: {
        // General UI
        ui: {
            title: "8-Puzzle Çözücü",
            settings: "Ayarlar",
            theme: "Tema",
            lightMode: "☀️ Açık Mod",
            darkMode: "🌙 Koyu Mod",
            highContrastMode: "⚡ Yüksek Kontrast",
            language: "Dil",
            turkish: "🇹🇷 Türkçe",
            english: "🇺🇸 English",
            soundEffects: "Ses Efektleri",
            educationMode: "Eğitim Modu",
            performanceAnalysis: "Performans Analizi",
            realTimeGraphs: "Gerçek Zamanlı Grafikler"
        },
        
        // Board section
        board: {
            heading: "Tahta",
            randomize: "Rastgele durum oluştur",
            customState: "Özel Durum Gir",
            tileLabel: "Puzzle parçası {{number}}",
            emptySpace: "Boş alan satır {{row}}, sütun {{col}}",
            boardState: "Tahta durumu: {{description}}"
        },
        
        // Search section
        search: {
            heading: "Arama",
            algorithm: "Algoritma",
            iterationLimit: "İterasyon Sınırı",
            depthLimit: "Derinlik Sınırı",
            timeLimit: "Zaman Sınırı (saniye)",
            heuristicFunction: "Sezgisel Fonksiyon",
            iterateStep: "Adım adım ilerlet",
            search: "Çözümü ara",
            stop: "Durdur",
            
            // Algorithm types
            algorithms: {
                breadthFirst: "Önce Genişlik",
                uniformCost: "Sabit Maliyet",
                depthFirst: "Önce Derinlik", 
                iterativeDeepening: "Yinelemeli Derinlik",
                greedyBest: "Açgözlü-En İyi",
                aStar: "A*"
            },
            
            // Algorithm groups
            algorithmGroups: {
                uninformed: "Bilgisiz Arama",
                informed: "Bilgili Arama"
            },
            
            // Heuristic functions
            heuristics: {
                manhattan: "Manhattan Mesafesi",
                euclidean: "Öklid Mesafesi", 
                misplaced: "Yanlış Yerleştirilmiş Parçalar",
                linearConflict: "Doğrusal Çakışma",
                walkingDistance: "Yürüme Mesafesi",
                cornerTiles: "Köşe Parçaları",
                maxHeuristic: "Maksimum Sezgisel"
            }
        },
        
        // Solution navigation
        solution: {
            heading: "Çözüm Navigasyonu",
            previous: "← Önceki",
            next: "Sonraki →",
            reset: "Sıfırla",
            replay: "Çözümü oynat",
            stopReplay: "Oynatmayı durdur",
            pause: "Duraklat",
            resume: "Devam et"
        },
        
        // Search results
        results: {
            heading: "Arama Sonucu",
            solved: "Çözüldü! Derinlik: {{depth}}",
            iteration: "İterasyon: {{iteration}}",
            solutionCost: "Çözüm Maliyeti: {{cost}}",
            pathLength: "Çözüm Yolu Uzunluğu: {{length}}",
            expandedNodes: "Genişletilen düğümler: {{expanded}} / {{max}}",
            frontierNodes: "Sınır düğümleri: {{frontier}} / {{max}}",
            stepped: "Adımlı",
            unsolvable: "Bu puzzle konfigürasyonu çözülemez. Lütfen rastgele yapın veya farklı bir durum girin."
        },
        
        // Progress indicator
        progress: {
            label: "Arama İlerleme",
            iteration: "İterasyon {{current}} / {{max}}",
            timeLimit: "Zaman sınırı: {{limit}} saniye"
        },
        
        // Keyboard shortcuts
        keyboard: {
            title: "Klavye Kısayolları",
            navigate: "Adımları gezin",
            reset: "Başa sıfırla",
            end: "Sona git",
            toggleSearch: "Aramayı aç/kapat",
            startSearch: "Aramayı başlat",
            stopSearch: "Aramayı durdur",
            randomize: "Rastgele",
            stepSearch: "Adım ara",
            customInput: "Özel durum gir",
            performance: "Performans aç/kapat",
            visualization: "Görselleştirme aç/kapat",
            education: "Eğitim modu aç/kapat",
            theme: "Tema değiştir",
            help: "Yardım göster"
        },
        
        // Performance panel
        performance: {
            title: "📊 Performans Analizi",
            currentMetrics: "Mevcut Algoritma Metrikleri",
            timeElapsed: "Geçen Süre:",
            nodesExpanded: "Genişletilen Düğümler:",
            frontierSize: "Sınır Boyutu:",
            duration: "Süre:",
            iterations: "İterasyonlar:",
            speed: "Hız:",
            expandedNodes: "Genişletilen Düğümler:",
            maxFrontier: "Maksimum Sınır:",
            memoryUsed: "Kullanılan Bellek:",
            iterPerSec: " iter/s",
            megabytes: " MB",
            runningComparison: "Karşılaştırma çalışıyor..."
        },
        
        // Real-time graphs
        graphs: {
            title: "📈 Gerçek Zamanlı İstatistikler",
            frontier: "Sınır düğümleri",
            expanded: "Genişletilen düğümler",
            iteration: "İterasyon", 
            time: "Süre",
            hValue: "H Değeri",
            fValue: "F Değeri",
            nodeCount: "Düğüm Sayısı",
            depth: "Derinlik",
            solutionCost: "Çözüm Maliyeti",
            pathLength: "Yol Uzunluğu",
            status: "Durum",
            solved: "Çözüldü",
            failed: "Başarısız",
            searching: "Arıyor..."
        },
        
        // Custom state modal
        customState: {
            title: "🎯 Özel Puzzle Durumu",
            tabs: {
                visual: "Görsel Editör",
                text: "Metin Girişi", 
                presets: "Hazır Ayarlar"
            },
            visual: {
                description: "Değerleri düzenlemek için parçalara tıklayın veya yeniden düzenlemek için sürükleyin",
                shuffle: "🔀 Karıştır",
                reset: "🔄 Sıfırla",
                clear: "🗑️ Temizle"
            },
            text: {
                description: "9 rakam girin (0-8), burada 0 boş alanı temsil eder",
                examples: "Örnekler:",
                initial: "Başlangıç Durumu",
                goal: "Hedef Durum",
                easy: "Kolay",
                medium: "Orta"
            },
            presets: {
                description: "Önceden tanımlanmış puzzle konfigürasyonlarından seçin",
                difficulties: {
                    easy: "Kolay",
                    medium: "Orta", 
                    hard: "Zor",
                    expert: "Uzman"
                },
                moves: {
                    two: "2 hamle ile çözülebilir",
                    four: "4 hamle ile çözülebilir",
                    six: "6 hamle ile çözülebilir",
                    eight: "8 hamle ile çözülebilir",
                    ten: "10 hamle ile çözülebilir",
                    twelve: "12 hamle ile çözülebilir",
                    fifteen: "15 hamle ile çözülebilir",
                    twenty: "20 hamle ile çözülebilir"
                }
            },
            validation: {
                current: "Mevcut:",
                valid: "✓ Geçerli puzzle durumu",
                validSolvable: "Geçerli ve çözülebilir puzzle durumu",
                validUnsolvable: "Geçerli ancak çözülemez puzzle durumu", 
                invalid: "Geçersiz puzzle durumu",
                exactlyNine: "⚠️ Tam olarak 9 rakam (0-8) olmalı",
                eachDigit: "⚠️ Her rakam 0-8 tam olarak bir kez bulunmalı",
                unsolvableError: "Bu puzzle durumu çözülemez. Lütfen farklı bir konfigürasyon seçin."
            },
            buttons: {
                cancel: "İptal",
                apply: "Durumu Uygula"
            }
        },
        
        // Education content
        education: {
            title: "📚 Algoritma ve Sezgisellik için Bilgilendirme",
            tabs: {
                algorithm: "🔍 Algoritma",
                heuristic: "🎯 Sezgisel",
                tutorial: "📚 Öğretici",
                why: "🤔 Neden?",
                comparison: "📊 Karşılaştırma"
            },
            
            // Algorithm descriptions
            algorithms: {
                breadthFirst: {
                    name: "Genişlik-İlk Arama",
                    description: "Sonraki derinlik seviyesine geçmeden önce mevcut derinlikteki tüm düğümleri keşfeder.",
                    steps: {
                        "0": "Başlangıç durumunu kuyruğa ekle",
                        "1": "Kuyruktan bir düğüm çıkar",
                        "2": "Hedef durumu kontrol et",
                        "3": "Alt düğümleri oluştur ve kuyruğa ekle",
                        "4": "Çözüm bulunana kadar tekrarla"
                    },
                    pros: {
                        "0": "En kısa yolu garanti eder",
                        "1": "Tam algoritma"
                    },
                    cons: {
                        "0": "Yüksek bellek kullanımı",
                        "1": "Derin çözümler için yavaş olabilir"
                    }
                },
                depthFirst: {
                    name: "Derinlik-İlk Arama", 
                    description: "Geri dönmeden önce her dalda mümkün olduğunca derinlere kadar keşfeder.",
                    steps: {
                        "0": "Başlangıç durumunu yığına ekle",
                        "1": "Yığından bir düğüm çıkar", 
                        "2": "Hedef durumu kontrol et",
                        "3": "Alt düğümleri oluştur ve yığına ekle",
                        "4": "Çözüm bulunana kadar tekrarla"
                    },
                    pros: {
                        "0": "Düşük bellek kullanımı",
                        "1": "Başlangıç noktasına yakın çözümler için hızlı"
                    },
                    cons: {
                        "0": "Optimal çözüm bulamayabilir",
                        "1": "Sonsuz döngülerde takılabilir"
                    }
                },
                uniformCost: {
                    name: "Düzgün Maliyet Arama",
                    description: "Düğümleri başlangıçtan itibaren yol maliyetine göre keşfeder.",
                    steps: {
                        "0": "Başlangıç durumunu öncelik kuyruğuna ekle",
                        "1": "En düşük maliyetli düğümü çıkar",
                        "2": "Hedef durumu kontrol et", 
                        "3": "Alt düğümleri oluştur ve kuyruğa ekle",
                        "4": "Çözüm bulunana kadar tekrarla"
                    },
                    pros: {
                        "0": "Optimal çözüm garanti eder",
                        "1": "Maliyet farkında"
                    },
                    cons: {
                        "0": "Orta seviye bellek kullanımı",
                        "1": "Sezgisel bilgi kullanmaz"
                    }
                },
                greedyBest: {
                    name: "Açgözlü En İyi İlk Arama",
                    description: "Aramayı hedefe yönlendirmek için sezgisel fonksiyon kullanır.",
                    steps: {
                        "0": "Başlangıç durumunu öncelik kuyruğuna ekle",
                        "1": "En düşük sezgisel değerli düğümü çıkar",
                        "2": "Hedef durumu kontrol et",
                        "3": "Alt düğümleri hesapla ve kuyruğa ekle", 
                        "4": "Çözüm bulunana kadar tekrarla"
                    },
                    pros: {
                        "0": "Hızlı sonuçlar",
                        "1": "Düşük bellek kullanımı"
                    },
                    cons: {
                        "0": "Optimal çözüm garanti etmez",
                        "1": "Sezgisele aşırı bağımlı"
                    }
                },
                aStar: {
                    name: "A* Arama",
                    description: "Optimal yol bulma için yol maliyeti ve sezgisel bilgiyi birleştirir.",
                    steps: {
                        "0": "Başlangıç durumunu öncelik kuyruğuna ekle",
                        "1": "En düşük f(n) = g(n) + h(n) değerli düğümü çıkar",
                        "2": "Hedef durumu kontrol et",
                        "3": "Alt düğümleri hesapla ve kuyruğa ekle",
                        "4": "Çözüm bulunana kadar tekrarla"
                    },
                    pros: {
                        "0": "Optimal çözüm garanti eder",
                        "1": "Verimli heuristic kullanımı"
                    },
                    cons: {
                        "0": "Orta seviye bellek kullanımı",
                        "1": "İyi sezgisel gerektirir"
                    }
                },
                iterativeDeepening: {
                    name: "Yinelemeli Derinleştirme",
                    description: "Genişlik-ilk ve derinlik-ilk aramanın avantajlarını birleştirir.",
                    steps: {
                        "0": "Derinlik sınırını 0'dan başlat",
                        "1": "Mevcut sınırla derinlik-ilk arama yap",
                        "2": "Çözüm bulunamazsa sınırı artır",
                        "3": "Çözüm bulunana kadar tekrarla",
                        "4": "Her seviye için süreci yinele"
                    },
                    pros: {
                        "0": "Düşük bellek kullanımı",
                        "1": "Optimal çözüm garanti eder"
                    },
                    cons: {
                        "0": "Düğümleri tekrar ziyaret eder",
                        "1": "Yüksek hesaplama maliyeti"
                    }
                }
            },
            
            // Heuristic descriptions
            heuristics: {
                manhattan: {
                    name: "Manhattan Mesafesi",
                    description: "Her parçanın hedef konumuna olan yatay ve dikey mesafelerinin toplamı",
                    formula: "h(n) = Σ |mevcut_satır - hedef_satır| + |mevcut_sütun - hedef_sütun|",
                    pros: {
                        "0": "Hesaplama açısından verimli",
                        "1": "İyi yol gösterme"
                    },
                    cons: {
                        "0": "Çakışmaları görmezden gelir",
                        "1": "Bazen iyimser tahmin"
                    },
                    example: "Parça 1 (1,2) konumunda ve hedef (0,0) ise, Manhattan mesafesi = |1-0| + |2-0| = 3"
                },
                euclidean: {
                    name: "Öklid Mesafesi",
                    description: "Her parçanın hedef konumuna olan düz çizgi geometrik mesafesi",
                    formula: "h(n) = Σ √((mevcut_satır - hedef_satır)² + (mevcut_sütun - hedef_sütun)²)",
                    pros: {
                        "0": "Geometrik olarak doğru",
                        "1": "Smooth tahminler"
                    },
                    cons: {
                        "0": "Manhattan'dan daha hesaplama yoğun",
                        "1": "8-puzzle için Manhattan kadar etkili değil"
                    },
                    example: "Parça 1 (1,2) konumunda ve hedef (0,0) ise, Öklid mesafesi = √((1-0)² + (2-0)²) = √5 ≈ 2.24"
                },
                misplaced: {
                    name: "Yanlış Yerleştirilmiş Parçalar",
                    description: "Hedef konumunda olmayan parça sayısı",
                    formula: "h(n) = yanlış konumdaki parça sayısı",
                    pros: {
                        "0": "Çok basit hesaplama",
                        "1": "Anlaşılması kolay"
                    },
                    cons: {
                        "0": "Çok kabaca tahmin",
                        "1": "Optimal olmayan sonuçlar verebilir"
                    },
                    example: "8 parçadan 5'i yanlış konumdaysa, yanlış yerleştirilmiş parça değeri = 5"
                },
                linearConflict: {
                    name: "Doğrusal Çakışma", 
                    description: "Manhattan mesafesi artı aynı satır/sütundaki çakışma cezası",
                    formula: "h(n) = Manhattan + 2 × çakışmalar",
                    pros: {
                        "0": "Manhattan'dan daha doğru",
                        "1": "Çakışmaları hesaba katar"
                    },
                    cons: {
                        "0": "Daha karmaşık hesaplama",
                        "1": "Hala iyimser olabilir"
                    },
                    example: "Parça 1 ve 2 aynı satırda ama ters sıradaysa, 2 ekstra hamle cezası eklenir"
                },
                walkingDistance: {
                    name: "Yürüme Mesafesi",
                    description: "Manhattan artı dikey ve yatay çakışma çözümü maliyeti",
                    formula: "h(n) = Manhattan + 2 × (dikey_çakışmalar + yatay_çakışmalar)",
                    pros: {
                        "0": "Çok doğru tahminler",
                        "1": "Gelişmiş çakışma algılama"
                    },
                    cons: {
                        "0": "Hesaplama yoğun",
                        "1": "Karmaşık uygulama"
                    },
                    example: "Satır ve sütun çakışmalarının her biri için ek hamle maliyeti hesaplanır"
                },
                cornerTiles: {
                    name: "Köşe Parçaları",
                    description: "Köşe konumlarındaki parçalar için yapı farkında ceza",
                    formula: "h(n) = Manhattan + köşe_cezaları",
                    pros: {
                        "0": "Yapısal bilgi kullanır",
                        "1": "Köşe zorluklarını hesaba katar"
                    },
                    cons: {
                        "0": "Sadece köşelere odaklanır",
                        "1": "Sınırlı genel geçerlilik"
                    },
                    example: "Köşe parçaları yanlış konumdaysa ekstra ceza eklenir"
                },
                maxHeuristic: {
                    name: "Maksimum Sezgisel",
                    description: "Birden fazla sezgisel fonksiyonun maksimum değeri",
                    formula: "h(n) = max(h1(n), h2(n), ..., hk(n))",
                    pros: {
                        "0": "Birden fazla sezgiselin avantajlarını birleştirir",
                        "1": "Genellikle daha doğru"
                    },
                    cons: {
                        "0": "Tüm sezgiselleri hesaplama maliyeti",
                        "1": "Karmaşık uygulama"
                    },
                    example: "Manhattan=5, Linear Conflict=7, Walking Distance=6 ise, Max Heuristic=7"
                }
            },
            
            ready: "Başlamak için hazır...",
            startingSearch: "Arama algoritması başlatılıyor...",
            exploring: "İterasyon {{iteration}}: Keşfedilen durum {{state}}",
            solutionFound: "Çözüm bulundu! Son durum: {{state}}",
            searchFailed: "Arama başarısız oldu - Limitler dahilinde çözüm bulunamadı",
            selectHeuristic: "Bir Sezgisel Seçin",
            chooseHeuristic: "Detaylı bilgi görmek için bir sezgisel fonksiyon seçin.",
            
            // Common labels
            steps: "Adımlar:",
            pros: "Artıları:",
            cons: "Eksileri:",
            formula: "Formül:",
            example: "Örnek:",
            currentStep: "Mevcut Adım:",
            
            // Tutorial content
            tutorials: {
                breadthFirst: {
                    title: "Genişlik-İlk Arama Öğreticisi",
                    steps: {
                        "1": {
                            title: "4 Adımın 1'i",
                            heading: "BFS Öğreticisine Hoş Geldiniz",
                            content: "Bu puzzle'ı Genişlik-İlk Arama kullanarak çözeceğiz. BFS, derinlere inmeden önce mevcut derinlikteki tüm düğümleri keşfeder."
                        },
                        "2": {
                            title: "4 Adımın 2'si",
                            heading: "İlk Ayar",
                            content: "Bu puzzle durumu ile başlıyoruz. BFS başlangıç durumunu bir kuyruğa ekler (FIFO - İlk Giren, İlk Çıkar)."
                        },
                        "3": {
                            title: "4 Adımın 3'ü",
                            heading: "İlk Genişletme",
                            content: "Kuyruktan ilk düğümü çıkar ve genişlet. Tüm alt düğümlerini kuyruğun sonuna ekle."
                        },
                        "4": {
                            title: "4 Adımın 4'ü",
                            heading: "Aramaya Devam Et",
                            content: "Kuyruğun önünden düğümleri çıkarmaya ve genişletmeye devam et. Bu, derinlik-2'ye geçmeden önce tüm derinlik-1 düğümlerini keşfetmeyi garanti eder."
                        }
                    }
                },
                aStar: {
                    title: "A* Arama Öğreticisi",
                    steps: {
                        "1": {
                            title: "3 Adımın 1'i",
                            heading: "A* Öğreticisine Hoş Geldiniz",
                            content: "A*, optimal çözümleri verimli bir şekilde bulmak için yol maliyeti g(n) ve sezgisel h(n)'yi birleştirir."
                        },
                        "2": {
                            title: "3 Adımın 2'si",
                            heading: "f(n) = g(n) + h(n)'yi Anlamak",
                            content: "A*, f(n) = g(n) + h(n) kullanır; burada g(n) başlangıçtan maliyet, h(n) hedefe tahmini maliyettir."
                        },
                        "3": {
                            title: "3 Adımın 3'ü",
                            heading: "Düğüm Seçimi",
                            content: "A* her zaman sınırdan en düşük f(n) değerine sahip düğümü seçer."
                        }
                    }
                },
                heuristicComparison: {
                    title: "Sezgisel Karşılaştırma Öğreticisi",
                    steps: {
                        "1": {
                            title: "2 Adımın 1'i",
                            heading: "Sezgisel Karşılaştırma",
                            content: "Farklı sezgisellerin aynı puzzle üzerinde A* performansını nasıl etkilediğini görelim."
                        },
                        "2": {
                            title: "2 Adımın 2'si",
                            heading: "Manhattan vs Doğrusal Çakışma",
                            content: "Doğrusal Çakışma, doğru satır/sütunda olan ancak yanlış sırada bulunan parçalar için ceza ekler."
                        }
                    }
                }
            },
            
            // Real-time explanations
            realTimeDesc: "Gerçek zamanlı açıklamalar etkinleştirildi. Düğümlerin neden seçildiğini görmek için bir arama başlatın.",
            enableRealTimeExplanations: "Gerçek zamanlı açıklamaları etkinleştir",
            
            // Tutorial tab
            tutorialTitle: 'Etkileşimli Öğreticiler',
            chooseTutorial: 'Bir Öğretici Seçin:',
            beginnerBFS: '🟢 Başlangıç: Genişlik-İlk Arama',
            intermediateAStar: '🟡 Orta: A* Arama',
            advancedHeuristics: '🔴 İleri: Sezgisel Karşılaştırma',
            tutorialLabel: 'Öğretici',
            previousStep: '← Önceki',
            nextStep: 'Sonraki →',
            exitTutorial: 'Öğreticiden Çık',
            
            // Why tab
            whyTabTitle: '🤔 Bu Düğüm Neden?',
            currentSelection: 'Mevcut Düğüm Seçimi:',
            startSearchForExplanations: 'Açıklamaları görmek için bir arama başlatın...',
            frontierAnalysis: 'Sınır Analizi:',
            frontierSize: 'Sınır Boyutu:',
            selectedNodeFValue: 'Seçilen Düğüm f(n):',
            selectionReason: 'Seçim Nedeni:',
            alternativeNodes: 'Alternatif Düğümler:',
            iterateStepInstruction: 'Bu adımı kullanmak için Adım adım ilerlet butonunu kullanın.',
            
            // Comparison tab
            comparisonTitle: '📊 Algoritma vs Sezgisel Karşılaştırma',
            aspect: 'Yön',
            currentAlgorithm: 'Mevcut Algoritma',
            currentHeuristic: 'Mevcut Sezgisel',
            optimality: 'Optimallik',
            complexity: 'Karmaşıklık',
            memoryUsage: 'Bellek Kullanımı',
            bestUseCase: 'En İyi Kullanım Durumu',
            recommendation: '💡 Öneri:',
            selectAlgorithmForRecommendation: 'Öneriler görmek için bir algoritma ve sezgisel seçin.'
        },
        
        // Error messages
        errors: {
            randomizeFailed: "Puzzle rastgele yapılamadı. Lütfen tekrar deneyin.",
            randomizeError: "Rastgele yaparken hata: {{error}}",
            invalidIteration: "Geçersiz iterasyon sınırı",
            invalidDepth: "Geçersiz derinlik sınırı", 
            unsolvablePuzzle: "Bu puzzle konfigürasyonu çözülemez. Lütfen rastgele yapın veya farklı bir durum girin.",
            winnerNotFound: "Kazanan düğüm bulunamadı",
            frontierEmpty: "Sınır listesi boş",
            iterationLimitReached: "İterasyon sınırına ulaşıldı",
            timeLimitReached: "Zaman sınırına ulaşıldı", 
            searchStopped: "Arama durduruldu",
            searchStoppedByUser: "Arama kullanıcı tarafından durduruldu",
            unsupportedSearch: "Desteklenmeyen arama türü",
            enterTileValue: "Parça değeri girin (0-8):",
            validationError: "Puzzle durumu doğrulanırken hata: {{error}}"
        },
        
        // Accessibility
        accessibility: {
            soundHelp: "Etkileşimler için ses efektlerini etkinleştir veya devre dışı bırak",
            educationHelp: "Eğitici açıklamaları ve öğreticileri etkinleştir",
            performanceHelp: "Performans metriklerini ve analizini göster",
            graphsHelp: "Arama sırasında gerçek zamanlı performans grafiklerini göster"
        }
    },
    
    // English translations
    en: {
        // General UI
        ui: {
            title: "8-Puzzle Solver",
            settings: "Settings",
            theme: "Theme",
            lightMode: "☀️ Light Mode",
            darkMode: "🌙 Dark Mode",
            highContrastMode: "⚡ High Contrast",
            language: "Language",
            turkish: "🇹🇷 Türkçe",
            english: "🇺🇸 English",
            soundEffects: "Sound Effects",
            educationMode: "Education Mode",
            performanceAnalysis: "Performance Analysis",
            realTimeGraphs: "Real-time Graphs"
        },
        
        // Board section
        board: {
            heading: "Board",
            randomize: "Randomize",
            customState: "Enter Custom State",
            tileLabel: "Puzzle tile {{number}}",
            emptySpace: "Empty space at row {{row}}, column {{col}}",
            boardState: "Board state: {{description}}"
        },
        
        // Search section
        search: {
            heading: "Search",
            algorithm: "Algorithm",
            iterationLimit: "Iteration Limit",
            depthLimit: "Depth Limit",
            timeLimit: "Time Limit (seconds)",
            heuristicFunction: "Heuristic Function",
            iterateStep: "Iterate one step",
            search: "Search",
            stop: "Stop",
            
            // Algorithm types
            algorithms: {
                breadthFirst: "Breadth-First",
                uniformCost: "Uniform-Cost",
                depthFirst: "Depth-First",
                iterativeDeepening: "Iterative-Deepening",
                greedyBest: "Greedy-Best",
                aStar: "A*"
            },
            
            // Algorithm groups
            algorithmGroups: {
                uninformed: "Uninformed Search",
                informed: "Informed Search"
            },
            
            // Heuristic functions
            heuristics: {
                manhattan: "Manhattan Distance",
                euclidean: "Euclidean Distance",
                misplaced: "Misplaced Tiles",
                linearConflict: "Linear Conflict",
                walkingDistance: "Walking Distance",
                cornerTiles: "Corner Tiles",
                maxHeuristic: "Max Heuristic"
            }
        },
        
        // Solution navigation
        solution: {
            heading: "Solution Navigation",
            previous: "← Previous",
            next: "Next →",
            reset: "Reset",
            replay: "Replay solution",
            stopReplay: "Stop replaying",
            pause: "Pause",
            resume: "Resume"
        },
        
        // Search results
        results: {
            heading: "Search Result",
            solved: "Solved! Depth: {{depth}}",
            iteration: "Iteration: {{iteration}}",
            solutionCost: "Solution Cost: {{cost}}",
            pathLength: "Solution Path Length: {{length}}",
            expandedNodes: "Expanded nodes: {{expanded}} / {{max}}",
            frontierNodes: "Frontier nodes: {{frontier}} / {{max}}",
            stepped: "Stepped",
            unsolvable: "This puzzle configuration is not solvable. Please randomize or enter a different state."
        },
        
        // Progress indicator
        progress: {
            label: "Search Progress",
            iteration: "Iteration {{current}} / {{max}}",
            timeLimit: "Time limit: {{limit}} seconds"
        },
        
        // Keyboard shortcuts
        keyboard: {
            title: "Keyboard Shortcuts",
            navigate: "Navigate steps",
            reset: "Reset to start",
            end: "Go to end",
            toggleSearch: "Toggle search",
            startSearch: "Start search",
            stopSearch: "Stop search",
            randomize: "Randomize",
            stepSearch: "Step search",
            customInput: "Custom input",
            performance: "Toggle performance",
            visualization: "Toggle visualization",
            education: "Toggle education",
            theme: "Cycle theme",
            help: "Show help"
        },
        
        // Performance panel
        performance: {
            title: "📊 Performance Analysis",
            currentMetrics: "Current Algorithm Metrics",
            timeElapsed: "Time Elapsed:",
            nodesExpanded: "Nodes Expanded:",
            frontierSize: "Frontier Size:",
            duration: "Duration:",
            iterations: "Iterations:",
            speed: "Speed:",
            expandedNodes: "Expanded Nodes:",
            maxFrontier: "Max Frontier:",
            memoryUsed: "Memory Used:",
            iterPerSec: " iter/s",
            megabytes: " MB",
            runningComparison: "Running comparison..."
        },
        
        // Real-time graphs
        graphs: {
            title: "📈 Real-time Statistics",
            frontier: "Frontier nodes",
            expanded: "Expanded nodes",
            iteration: "Iteration",
            time: "Time",
            hValue: "H Value",
            fValue: "F Value",
            nodeCount: "Node Count",
            depth: "Depth",
            solutionCost: "Solution Cost",
            pathLength: "Path Length",
            status: "Status",
            solved: "Solved",
            failed: "Failed",
            searching: "Searching..."
        },
        
        // Custom state modal
        customState: {
            title: "🎯 Custom Puzzle State",
            tabs: {
                visual: "Visual Editor",
                text: "Text Input",
                presets: "Presets"
            },
            visual: {
                description: "Click tiles to edit values or drag to rearrange",
                shuffle: "🔀 Shuffle",
                reset: "🔄 Reset",
                clear: "🗑️ Clear"
            },
            text: {
                description: "Enter 9 digits (0-8), where 0 represents the empty space",
                examples: "Examples:",
                initial: "Initial State",
                goal: "Goal State",
                easy: "Easy",
                medium: "Medium"
            },
            presets: {
                description: "Choose from predefined puzzle configurations",
                difficulties: {
                    easy: "Easy",
                    medium: "Medium",
                    hard: "Hard",
                    expert: "Expert"
                },
                moves: {
                    two: "2 moves to solve",
                    four: "4 moves to solve",
                    six: "6 moves to solve",
                    eight: "8 moves to solve",
                    ten: "10 moves to solve",
                    twelve: "12 moves to solve",
                    fifteen: "15 moves to solve",
                    twenty: "20 moves to solve"
                }
            },
            validation: {
                current: "Current:",
                valid: "✓ Valid puzzle state",
                validSolvable: "Valid and solvable puzzle state",
                validUnsolvable: "Valid but unsolvable puzzle state",
                invalid: "Invalid puzzle state",
                exactlyNine: "⚠️ Must be exactly 9 digits (0-8)",
                eachDigit: "⚠️ Must contain each digit 0-8 exactly once",
                unsolvableError: "This puzzle state is not solvable. Please choose a different configuration."
            },
            buttons: {
                cancel: "Cancel",
                apply: "Apply State"
            }
        },
        
        // Education content
        education: {
            title: "📚 Algorithm and Heuristic Information Guide",
            tabs: {
                algorithm: "🔍 Algorithm",
                heuristic: "🎯 Heuristic",
                tutorial: "📚 Tutorial",
                why: "🤔 Why?",
                comparison: "📊 Comparison"
            },
            
            // Algorithm descriptions
            algorithms: {
                breadthFirst: {
                    name: "Breadth-First Search",
                    description: "Explores all nodes at the current depth before moving to the next depth level.",
                    steps: {
                        "0": "Add initial state to queue",
                        "1": "Remove a node from queue",
                        "2": "Check for goal state",
                        "3": "Generate children and add to queue",
                        "4": "Repeat until solution found"
                    },
                    pros: {
                        "0": "Guarantees shortest path",
                        "1": "Complete algorithm"
                    },
                    cons: {
                        "0": "High memory usage",
                        "1": "Can be slow for deep solutions"
                    }
                },
                depthFirst: {
                    name: "Depth-First Search",
                    description: "Explores as far as possible along each branch before backtracking.",
                    steps: {
                        "0": "Add initial state to stack",
                        "1": "Remove a node from stack",
                        "2": "Check for goal state",
                        "3": "Generate children and add to stack",
                        "4": "Repeat until solution found"
                    },
                    pros: {
                        "0": "Low memory usage",
                        "1": "Fast for solutions near starting point"
                    },
                    cons: {
                        "0": "May not find optimal solution",
                        "1": "Can get stuck in infinite loops"
                    }
                },
                uniformCost: {
                    name: "Uniform Cost Search",
                    description: "Explores nodes in order of their path cost from start.",
                    steps: {
                        "0": "Add initial state to priority queue",
                        "1": "Remove lowest cost node",
                        "2": "Check for goal state",
                        "3": "Generate children and add to queue",
                        "4": "Repeat until solution found"
                    },
                    pros: {
                        "0": "Guarantees optimal solution",
                        "1": "Cost-aware"
                    },
                    cons: {
                        "0": "Moderate memory usage",
                        "1": "Doesn't use heuristic information"
                    }
                },
                greedyBest: {
                    name: "Greedy Best-First Search",
                    description: "Uses heuristic function to guide search toward goal.",
                    steps: {
                        "0": "Add initial state to priority queue",
                        "1": "Remove node with lowest heuristic value",
                        "2": "Check for goal state",
                        "3": "Calculate children and add to queue",
                        "4": "Repeat until solution found"
                    },
                    pros: {
                        "0": "Fast results",
                        "1": "Low memory usage"
                    },
                    cons: {
                        "0": "No guarantee of optimal solution",
                        "1": "Overly dependent on heuristic"
                    }
                },
                aStar: {
                    name: "A* Search",
                    description: "Combines path cost and heuristic for optimal pathfinding.",
                    steps: {
                        "0": "Add initial state to priority queue",
                        "1": "Remove node with lowest f(n) = g(n) + h(n)",
                        "2": "Check for goal state",
                        "3": "Calculate children and add to queue",
                        "4": "Repeat until solution found"
                    },
                    pros: {
                        "0": "Guarantees optimal solution",
                        "1": "Efficient heuristic usage"
                    },
                    cons: {
                        "0": "Moderate memory usage",
                        "1": "Requires good heuristic"
                    }
                },
                iterativeDeepening: {
                    name: "Iterative Deepening",
                    description: "Combines benefits of breadth-first and depth-first search.",
                    steps: {
                        "0": "Start with depth limit of 0",
                        "1": "Perform depth-first search with current limit",
                        "2": "If no solution found, increase limit",
                        "3": "Repeat until solution found",
                        "4": "Iterate process for each level"
                    },
                    pros: {
                        "0": "Low memory usage",
                        "1": "Guarantees optimal solution"
                    },
                    cons: {
                        "0": "Revisits nodes",
                        "1": "High computational cost"
                    }
                }
            },
            
            // Heuristic descriptions
            heuristics: {
                manhattan: {
                    name: "Manhattan Distance",
                    description: "Sum of horizontal and vertical distances of each tile from its goal position",
                    formula: "h(n) = Σ |current_row - goal_row| + |current_col - goal_col|",
                    pros: {
                        "0": "Computationally efficient",
                        "1": "Good guidance"
                    },
                    cons: {
                        "0": "Ignores conflicts",
                        "1": "Sometimes optimistic"
                    },
                    example: "If tile 1 is at (1,2) and goal is (0,0), Manhattan distance = |1-0| + |2-0| = 3"
                },
                euclidean: {
                    name: "Euclidean Distance",
                    description: "Straight-line geometric distance of each tile to its goal position",
                    formula: "h(n) = Σ √((current_row - goal_row)² + (current_col - goal_col)²)",
                    pros: {
                        "0": "Geometrically accurate",
                        "1": "Smooth estimates"
                    },
                    cons: {
                        "0": "More computationally intensive than Manhattan",
                        "1": "Not as effective as Manhattan for 8-puzzle"
                    },
                    example: "If tile 1 is at (1,2) and goal is (0,0), Euclidean distance = √((1-0)² + (2-0)²) = √5 ≈ 2.24"
                },
                misplaced: {
                    name: "Misplaced Tiles",
                    description: "Count of tiles not in their goal positions",
                    formula: "h(n) = number of tiles in wrong positions",
                    pros: {
                        "0": "Very simple to compute",
                        "1": "Easy to understand"
                    },
                    cons: {
                        "0": "Very rough estimate",
                        "1": "Can lead to suboptimal results"
                    },
                    example: "If 5 out of 8 tiles are in wrong positions, misplaced tiles value = 5"
                },
                linearConflict: {
                    name: "Linear Conflict",
                    description: "Manhattan distance plus penalty for conflicts in same row/column",
                    formula: "h(n) = Manhattan + 2 × conflicts",
                    pros: {
                        "0": "More accurate than Manhattan",
                        "1": "Accounts for conflicts"
                    },
                    cons: {
                        "0": "More complex calculation",
                        "1": "Still can be optimistic"
                    },
                    example: "If tiles 1 and 2 are in same row but reversed order, add 2 extra moves penalty"
                },
                walkingDistance: {
                    name: "Walking Distance",
                    description: "Manhattan plus cost of resolving vertical and horizontal conflicts",
                    formula: "h(n) = Manhattan + 2 × (vertical_conflicts + horizontal_conflicts)",
                    pros: {
                        "0": "Very accurate estimates",
                        "1": "Advanced conflict detection"
                    },
                    cons: {
                        "0": "Computationally intensive",
                        "1": "Complex implementation"
                    },
                    example: "Additional move cost calculated for each row and column conflict"
                },
                cornerTiles: {
                    name: "Corner Tiles",
                    description: "Structure-aware penalty for tiles in corner positions",
                    formula: "h(n) = Manhattan + corner_penalties",
                    pros: {
                        "0": "Uses structural information",
                        "1": "Accounts for corner difficulties"
                    },
                    cons: {
                        "0": "Only focuses on corners",
                        "1": "Limited general applicability"
                    },
                    example: "Extra penalty added if corner tiles are in wrong positions"
                },
                maxHeuristic: {
                    name: "Maximum Heuristic",
                    description: "Maximum value of multiple heuristic functions",
                    formula: "h(n) = max(h1(n), h2(n), ..., hk(n))",
                    pros: {
                        "0": "Combines advantages of multiple heuristics",
                        "1": "Usually more accurate"
                    },
                    cons: {
                        "0": "Cost of computing all heuristics",
                        "1": "Complex implementation"
                    },
                    example: "If Manhattan=5, Linear Conflict=7, Walking Distance=6, then Max Heuristic=7"
                }
            },
            
            ready: "Ready to start...",
            startingSearch: "Starting search algorithm...",
            exploring: "Iteration {{iteration}}: Exploring state {{state}}",
            solutionFound: "Solution found! Final state: {{state}}",
            searchFailed: "Search failed - no solution found within limits.",
            selectHeuristic: "Select a Heuristic",
            chooseHeuristic: "Choose a heuristic function to see detailed information.",
            
            // Common labels
            steps: "Steps:",
            pros: "Pros:",
            cons: "Cons:",
            formula: "Formula:",
            example: "Example:",
            currentStep: "Current Step:",
            
            // Tutorial content
            tutorials: {
                breadthFirst: {
                    title: "Breadth-First Search Tutorial",
                    steps: {
                        "1": {
                            title: "Step 1 of 4",
                            heading: "Welcome to BFS Tutorial",
                            content: "We'll solve this puzzle using Breadth-First Search. BFS explores all nodes at the current depth before moving deeper."
                        },
                        "2": {
                            title: "Step 2 of 4",
                            heading: "Initial Setup",
                            content: "We start with this puzzle state. BFS adds the initial state to a queue (FIFO - First In, First Out)."
                        },
                        "3": {
                            title: "Step 3 of 4",
                            heading: "First Expansion",
                            content: "Remove the first node from queue and expand it. Add all its children to the end of the queue."
                        },
                        "4": {
                            title: "Step 4 of 4",
                            heading: "Continue Search",
                            content: "Keep removing nodes from front of queue and expanding them. This ensures we explore all depth-1 nodes before depth-2."
                        }
                    }
                },
                aStar: {
                    title: "A* Search Tutorial",
                    steps: {
                        "1": {
                            title: "Step 1 of 3",
                            heading: "Welcome to A* Tutorial",
                            content: "A* combines path cost g(n) and heuristic h(n) to find optimal solutions efficiently."
                        },
                        "2": {
                            title: "Step 2 of 3",
                            heading: "Understanding f(n) = g(n) + h(n)",
                            content: "A* uses f(n) = g(n) + h(n) where g(n) is cost from start and h(n) is estimated cost to goal."
                        },
                        "3": {
                            title: "Step 3 of 3",
                            heading: "Node Selection",
                            content: "A* always selects the node with lowest f(n) value from the frontier."
                        }
                    }
                },
                heuristicComparison: {
                    title: "Heuristic Comparison Tutorial",
                    steps: {
                        "1": {
                            title: "Step 1 of 2",
                            heading: "Heuristic Comparison",
                            content: "Let's see how different heuristics affect A* performance on the same puzzle."
                        },
                        "2": {
                            title: "Step 2 of 2",
                            heading: "Manhattan vs Linear Conflict",
                            content: "Linear Conflict adds penalties for tiles that are in correct row/column but wrong order."
                        }
                    }
                }
            },
            
            // Real-time explanations
            realTimeDesc: "Real-time explanations enabled. Start a search to see why nodes are selected.",
            enableRealTimeExplanations: "Enable real-time explanations",
            
            // Tutorial tab
            tutorialTitle: 'Interactive Tutorials',
            chooseTutorial: 'Choose a Tutorial:',
            beginnerBFS: '🟢 Beginner: Breadth-First Search',
            intermediateAStar: '🟡 Intermediate: A* Search',
            advancedHeuristics: '🔴 Advanced: Heuristic Comparison',
            tutorialLabel: 'Tutorial',
            previousStep: '← Previous',
            nextStep: 'Next →',
            exitTutorial: 'Exit Tutorial',
            
            // Why tab
            whyTabTitle: '🤔 Why This Node?',
            currentSelection: 'Current Node Selection:',
            startSearchForExplanations: 'Start a search to see explanations...',
            frontierAnalysis: 'Frontier Analysis:',
            frontierSize: 'Frontier Size:',
            selectedNodeFValue: 'Selected Node f(n):',
            selectionReason: 'Selection Reason:',
            alternativeNodes: 'Alternative Nodes:',
            iterateStepInstruction: 'Use the Iterate one step button to use this feature.',
            
            // Comparison tab
            comparisonTitle: '📊 Algorithm vs Heuristic Comparison',
            aspect: 'Aspect',
            currentAlgorithm: 'Current Algorithm',
            currentHeuristic: 'Current Heuristic',
            optimality: 'Optimality',
            complexity: 'Complexity',
            memoryUsage: 'Memory Usage',
            bestUseCase: 'Best Use Case',
            recommendation: '💡 Recommendation:',
            selectAlgorithmForRecommendation: 'Select an algorithm and heuristic to see recommendations.'
        },
        
        // Error messages
        errors: {
            randomizeFailed: "Failed to randomize puzzle. Please try again.",
            randomizeError: "Error during randomization: {{error}}",
            invalidIteration: "Invalid iteration limit",
            invalidDepth: "Invalid depth limit",
            unsolvablePuzzle: "This puzzle configuration is not solvable. Please randomize or enter a different state.",
            winnerNotFound: "Winner node could not found",
            frontierEmpty: "Frontier list is empty",
            iterationLimitReached: "Iteration limit reached",
            timeLimitReached: "Time limit reached",
            searchStopped: "Search stopped",
            searchStoppedByUser: "Search stopped by user",
            unsupportedSearch: "Unsupported search type",
            enterTileValue: "Enter tile value (0-8):",
            validationError: "Error validating puzzle state: {{error}}"
        },
        
        // Accessibility
        accessibility: {
            soundHelp: "Enable or disable sound effects for interactions",
            educationHelp: "Enable educational explanations and tutorials",
            performanceHelp: "Show performance metrics and analysis",
            graphsHelp: "Display real-time performance graphs during search"
        }
    }
};
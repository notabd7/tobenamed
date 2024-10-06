import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, View, Text, StyleSheet, pdf } from '@react-pdf/renderer';
import { Printer } from 'lucide-react';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#E4E4E4',
    padding: 10,
  },
  card: {
    width: '30%',
    height: '30%',
    margin: '1.5%',
    padding: 20,
    backgroundColor: '#FFFFFF', // Changed to white
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14, // Increased font size
    textAlign: 'center',
  },
});

// PDF Document component
const FlashcardsPDF = ({ flashCards }) => (
  <Document>
    {[...Array(Math.ceil(flashCards.length / 6))].map((_, pageIndex) => (
      <Page key={`page-${pageIndex}`} size="A4" style={styles.page}>
        {flashCards.slice(pageIndex * 6, (pageIndex + 1) * 6).map((card, index) => (
          <View key={`card-${index}`} style={styles.card}>
            <Text style={styles.text}>{pageIndex % 2 === 0 ? card.question : card.answer}</Text>
          </View>
        ))}
      </Page>
    ))}
  </Document>
);

export default function FlashcardsComponent() {
  const location = useLocation();
  const [flashCards, setFlashCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const rawFlashCardData = location.state?.flashCardData;
    console.log('Raw flashcard data:', rawFlashCardData);

    if (typeof rawFlashCardData === 'string') {
      try {
        const cleanedData = rawFlashCardData
          .replace(/^```json/, '')
          .replace(/```$/, '')
          .trim();

        console.log('Cleaned flashcard data:', cleanedData);

        const parsedData = JSON.parse(cleanedData);
        console.log('Parsed flashcard data:', parsedData);

        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setFlashCards(parsedData);
          console.log('Flashcards set:', parsedData);
        } else {
          console.log('Parsed data is not an array or is empty');
        }
      } catch (error) {
        console.error('Error parsing flashcard data:', error);
      }
    } else {
      console.log('Flashcard data is not a string, cannot parse');
    }
  }, [location.state]);

  useEffect(() => {
    console.log('Current flashcards state:', flashCards);
  }, [flashCards]);

  const downloadPDF = async () => {
    const blob = await pdf(<FlashcardsPDF flashCards={flashCards} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flashcards.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  const nextCard = () => {
    setDirection(1);
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashCards.length);
  };

  const prevCard = () => {
    setDirection(-1);
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + flashCards.length) % flashCards.length);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      zIndex: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      zIndex: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      zIndex: 0,
    }),
  };

  if (flashCards.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No flashcards available. Please upload a file to generate flashcards.
      </div>
    );
  }

  return (
    <div className="space-y-9">
      <h2 className="text-4xl font-bold text-gray-800">Your Flashcards</h2>
      <div className="bg-white p-9 rounded-xl shadow-lg">
        <div className="mb-6 flex justify-between items-center">
          <span className="text-xl text-gray-500">
            Card {currentCard + 1} of {flashCards.length}
          </span>
          <button
            onClick={downloadPDF}
            className="p-3 bg-custom-red-500 hover:bg-custom-orange-500 text-white rounded-lg transition-colors"
          >
            <Printer size={24} />
          </button>
        </div>
        <div className="relative w-96 h-96 mx-auto perspective-1000">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentCard}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute w-full h-full"
            >
              <motion.div
                className="w-full h-full bg-gray-100 rounded-2xl shadow-lg cursor-pointer"
                onClick={flipCard}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  backfaceVisibility: 'hidden',
                  transformStyle: 'preserve-3d',
                }}
              >
                <motion.div
                  className="absolute w-full h-full flex items-center justify-center p-8 backface-hidden bg-gray-100 rounded-2xl"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isFlipped ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ transform: 'rotateY(0deg)' }}
                >
                  <p className="text-3xl text-center overflow-auto max-h-full">{flashCards[currentCard]?.question}</p>
                </motion.div>
                <motion.div
                  className="absolute w-full h-full flex items-center justify-center p-8 backface-hidden bg-gray-100 rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isFlipped ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <p className="text-3xl text-center overflow-auto max-h-full">{flashCards[currentCard]?.answer}</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex justify-between">
          <button
            onClick={prevCard}
            className="px-6 py-3 text-xl bg-custom-red-500 text-white rounded-lg hover:bg-custom-orange-500 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={nextCard}
            className="px-6 py-3 text-xl bg-custom-red-500 text-white rounded-lg hover:bg-custom-orange-500 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
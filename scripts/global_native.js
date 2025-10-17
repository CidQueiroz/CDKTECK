import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  useColorScheme,
  StatusBar,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ======================================================
// HOOK PERSONALIZADO PARA TEMA
// ======================================================
const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(systemColorScheme || 'light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  return { theme, toggleTheme };
};

// ======================================================
// HOOK PARA BOTÃO VOLTAR AO TOPO
// ======================================================
const useBackToTop = () => {
  const [showButton, setShowButton] = useState(false);
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowButton(offsetY > 300);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return { showButton, scrollToTop, handleScroll, scrollViewRef };
};

// ======================================================
// COMPONENTE MODAL REUTILIZÁVEL
// ======================================================
const CustomModal = ({ visible, onClose, title, children, theme }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const isDark = theme === 'dark';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            isDark ? styles.modalContainerDark : styles.modalContainerLight,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <View style={[styles.modalHeader, isDark && styles.modalHeaderDark]}>
            <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>{children}</View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

// ======================================================
// COMPONENTE DE CONTATO
// ======================================================
const ContactForm = ({ theme, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const isDark = theme === 'dark';

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos');
      return;
    }

    console.log('Dados enviados:', formData);
    Alert.alert('Sucesso', 'Formulário enviado com sucesso!', [
      { text: 'OK', onPress: onClose },
    ]);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={[styles.label, isDark && styles.labelDark]}>Nome</Text>
      <TextInput
        style={[styles.input, isDark && styles.inputDark]}
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        placeholder="Seu nome"
        placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
      />

      <Text style={[styles.label, isDark && styles.labelDark]}>Email</Text>
      <TextInput
        style={[styles.input, isDark && styles.inputDark]}
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        placeholder="seu@email.com"
        placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={[styles.label, isDark && styles.labelDark]}>Mensagem</Text>
      <TextInput
        style={[styles.input, styles.textArea, isDark && styles.inputDark]}
        value={formData.message}
        onChangeText={(text) => setFormData({ ...formData, message: text })}
        placeholder="Digite sua mensagem"
        placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};

// ======================================================
// COMPONENTE HEADER
// ======================================================
const Header = ({ onContactClick, onThemeToggle, theme }) => {
  const isDark = theme === 'dark';

  return (
    <View style={[styles.header, isDark && styles.headerDark]}>
      <Text style={[styles.logo, isDark && styles.logoDark]}>MeuApp</Text>
      <View style={styles.headerButtons}>
        <TouchableOpacity onPress={onContactClick} style={styles.headerButton}>
          <Text style={[styles.headerButtonText, isDark && styles.headerButtonTextDark]}>
            Contato
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onThemeToggle}
          style={[styles.themeButton, isDark && styles.themeButtonDark]}
        >
          <Text style={styles.themeButtonText}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ======================================================
// COMPONENTE PRINCIPAL - APP
// ======================================================
const App = () => {
  const { theme, toggleTheme } = useTheme();
  const { showButton, scrollToTop, handleScroll, scrollViewRef } = useBackToTop();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#FFFFFF'}
      />

      <Header
        onContactClick={() => setIsContactModalOpen(true)}
        onThemeToggle={toggleTheme}
        theme={theme}
      />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.title, isDark && styles.titleDark]}>
              Bem-vindo ao Seu App!
            </Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              Conversão completa de scripts para React Native
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
              Sobre
            </Text>
            <Text style={[styles.text, isDark && styles.textDark]}>
              Este projeto demonstra como converter funcionalidades JavaScript
              vanilla para React Native, incluindo gerenciamento de tema, modais
              e navegação.
            </Text>
          </View>

          {/* Seções de exemplo */}
          {[...Array(8)].map((_, i) => (
            <View
              key={i}
              style={[styles.card, isDark && styles.cardDark]}
            >
              <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>
                Seção {i + 1}
              </Text>
              <Text style={[styles.cardText, isDark && styles.cardTextDark]}>
                Conteúdo de exemplo para demonstrar o funcionamento completo.
                Role para baixo para ver o botão "voltar ao topo" aparecer
                automaticamente após rolar mais de 300px.
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal de Contato */}
      <CustomModal
        visible={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="Entre em Contato"
        theme={theme}
      >
        <ContactForm theme={theme} onClose={() => setIsContactModalOpen(false)} />
      </CustomModal>

      {/* Botão Voltar ao Topo */}
      {showButton && (
        <TouchableOpacity
          style={[styles.backToTopButton, isDark && styles.backToTopButtonDark]}
          onPress={scrollToTop}
          activeOpacity={0.8}
        >
          <Text style={styles.backToTopText}>↑</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

// ======================================================
// ESTILOS
// ======================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerDark: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  logoDark: {
    color: '#FFFFFF',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginRight: 12,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#4B5563',
  },
  headerButtonTextDark: {
    color: '#D1D5DB',
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeButtonDark: {
    backgroundColor: '#374151',
  },
  themeButtonText: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
  },
  subtitleDark: {
    color: '#9CA3AF',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  text: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  textDark: {
    color: '#D1D5DB',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardDark: {
    backgroundColor: '#1F2937',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardTitleDark: {
    color: '#FFFFFF',
  },
  cardText: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  cardTextDark: {
    color: '#9CA3AF',
  },
  backToTopButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  backToTopButtonDark: {
    backgroundColor: '#1D4ED8',
  },
  backToTopText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalContainerLight: {
    backgroundColor: '#FFFFFF',
  },
  modalContainerDark: {
    backgroundColor: '#1F2937',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalHeaderDark: {
    borderBottomColor: '#374151',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalTitleDark: {
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 32,
    color: '#6B7280',
    lineHeight: 32,
  },
  modalContent: {
    padding: 20,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  labelDark: {
    color: '#D1D5DB',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  inputDark: {
    borderColor: '#4B5563',
    backgroundColor: '#374151',
    color: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
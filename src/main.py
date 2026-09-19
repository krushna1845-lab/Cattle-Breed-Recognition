#!/usr/bin/env python3
"""
BreedSight AI - Python Desktop Application
Cattle and Buffalo Breed Recognition System
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import customtkinter as ctk
from PIL import Image, ImageTk, ImageDraw
import speech_recognition as sr
import pyttsx3
import threading
import time
import random
import os
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum

# Set appearance mode and color theme
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

class Screen(Enum):
    HOME = "home"
    VOICE = "voice"
    UPLOAD = "upload"
    DETECTION = "detection"
    HEALTH = "health"
    MILK_YIELD = "milk_yield"
    BREED_INFO = "breed_info"

class Language(Enum):
    EN = "en"
    HI = "hi"
    MR = "mr"

@dataclass
class BreedDetectionResult:
    breed_name: str
    confidence: float
    type: str  # "cattle" or "buffalo"
    age_estimate: str
    weight_estimate: str
    characteristics: List[str]

@dataclass
class HealthCondition:
    name: str
    risk_level: str  # "low", "medium", "high"
    symptoms: List[str]
    precautions: List[str]
    treatments: List[str]
    severity: int

class LanguageManager:
    """Manages translations for the application"""
    
    translations = {
        Language.EN: {
            "app_name": "BreedSight AI",
            "app_tagline": "Smart cattle & buffalo breed recognition powered by AI",
            "take_photo": "📸 Take / Upload Photo",
            "voice_input": "🎙 Voice Input / Language Select",
            "analyze_breed": "Analyze Breed",
            "breed_detected": "Breed Identified",
            "age_estimate": "Age Estimate",
            "weight_estimate": "Weight Estimate",
            "health_report": "Health Report",
            "milk_yield": "Milk Yield Analysis",
            "breed_info": "Breed Information",
            "back": "Back",
            "home": "Home",
            "language": "Language",
            "english": "English",
            "hindi": "हिंदी",
            "marathi": "मराठी",
            "upload_image": "Upload an image of cattle or buffalo",
            "analyzing": "Analyzing Image...",
            "confidence": "Confidence",
            "risk_level": "Risk Level",
            "low": "Low",
            "medium": "Medium",
            "high": "High",
            "precautions": "Precautions",
            "treatment": "Treatment",
            "milk_quantity": "Daily Milk Quantity (Liters)",
            "feed_type": "Feed Type",
            "grass": "Grass",
            "silage": "Silage",
            "mixed": "Mixed Feed",
            "suggestions": "Suggestions",
            "ideal_climate": "Ideal Climate",
            "common_diseases": "Common Diseases",
            "preventive_care": "Preventive Care"
        },
        Language.HI: {
            "app_name": "ब्रीडसाइट एआई",
            "app_tagline": "एआई द्वारा संचालित स्मार्ट गोवंश और भैंस नस्ल पहचान",
            "take_photo": "📸 फोटो लें / अपलोड करें",
            "voice_input": "🎙 आवाज इनपुट / भाषा चुनें",
            "analyze_breed": "नस्ल का विश्लेषण करें",
            "breed_detected": "नस्ल की पहचान हुई",
            "age_estimate": "आयु का अनुमान",
            "weight_estimate": "वजन का अनुमान",
            "health_report": "स्वास्थ्य रिपोर्ट",
            "milk_yield": "दूध उत्पादन विश्लेषण",
            "breed_info": "नस्ल की जानकारी",
            "back": "वापस",
            "home": "होम",
            "language": "भाषा",
            "english": "English",
            "hindi": "हिंदी",
            "marathi": "मराठी",
            "upload_image": "गोवंश या भैंस की तस्वीर अपलोड करें",
            "analyzing": "तस्वीर का विश्लेषण कर रहे हैं...",
            "confidence": "विश्वास",
            "risk_level": "जोखिम स्तर",
            "low": "कम",
            "medium": "मध्यम",
            "high": "उच्च",
            "precautions": "सावधानियां",
            "treatment": "उपचार",
            "milk_quantity": "दैनिक दूध मात्रा (लीटर)",
            "feed_type": "चारा प्रकार",
            "grass": "घास",
            "silage": "साइलेज",
            "mixed": "मिश्रित चारा",
            "suggestions": "सुझाव",
            "ideal_climate": "आदर्श जलवायु",
            "common_diseases": "सामान्य रोग",
            "preventive_care": "निवारक देखभाल"
        },
        Language.MR: {
            "app_name": "ब्रीडसाइट एआय",
            "app_tagline": "एआय द्वारे चालित स्मार्ट गुरेढोरे आणि म्हशीची जात ओळख",
            "take_photo": "📸 फोटो काढा / अपलोड करा",
            "voice_input": "🎙 आवाज इनपुट / भाषा निवडा",
            "analyze_breed": "जातीचे विश्लेषण करा",
            "breed_detected": "जातीची ओळख झाली",
            "age_estimate": "वयाचा अंदाज",
            "weight_estimate": "वजनाचा अंदाज",
            "health_report": "आरोग्य अहवाल",
            "milk_yield": "दूध उत्पादन विश्लेषण",
            "breed_info": "जातीची माहिती",
            "back": "परत",
            "home": "होम",
            "language": "भाषा",
            "english": "English",
            "hindi": "हिंदी",
            "marathi": "मराठी",
            "upload_image": "गुरेढोरे किंवा म्हशीचा फोटो अपलोड करा",
            "analyzing": "फोटोचे विश्लेषण करत आहोत...",
            "confidence": "विश्वास",
            "risk_level": "धोका पातळी",
            "low": "कमी",
            "medium": "मध्यम",
            "high": "जास्त",
            "precautions": "खबरदारी",
            "treatment": "उपचार",
            "milk_quantity": "दैनिक दूध प्रमाण (लिटर)",
            "feed_type": "आहार प्रकार",
            "grass": "गवत",
            "silage": "सायलेज",
            "mixed": "मिश्र आहार",
            "suggestions": "सूचना",
            "ideal_climate": "आदर्श हवामान",
            "common_diseases": "सामान्य आजार",
            "preventive_care": "प्रतिबंधक काळजी"
        }
    }
    
    def __init__(self):
        self.current_language = Language.EN
    
    def set_language(self, language: Language):
        self.current_language = language
    
    def t(self, key: str) -> str:
        """Get translation for the given key"""
        return self.translations[self.current_language].get(key, key)

class BreedDatabase:
    """Mock database for breed information"""
    
    breeds = [
        {
            "breed_name": "Gir",
            "type": "cattle",
            "confidence": 0.95,
            "characteristics": ["White/red coat", "Drooping ears", "Prominent hump"]
        },
        {
            "breed_name": "Sahiwal",
            "type": "cattle", 
            "confidence": 0.89,
            "characteristics": ["Red/brown coat", "Medium size", "Good milk producer"]
        },
        {
            "breed_name": "Red Sindhi",
            "type": "cattle",
            "confidence": 0.87,
            "characteristics": ["Red coat", "Compact body", "Heat tolerant"]
        },
        {
            "breed_name": "Murrah Buffalo",
            "type": "buffalo",
            "confidence": 0.92,
            "characteristics": ["Black coat", "Curved horns", "High milk yield"]
        },
        {
            "breed_name": "Surti Buffalo", 
            "type": "buffalo",
            "confidence": 0.85,
            "characteristics": ["Light brown coat", "Medium size", "Good milk quality"]
        }
    ]
    
    health_conditions = [
        HealthCondition(
            name="Foot and Mouth Disease",
            risk_level="high",
            symptoms=["Fever", "Loss of appetite", "Blisters on mouth and feet"],
            precautions=["Regular vaccination", "Quarantine new animals", "Maintain hygiene"],
            treatments=["Immediate veterinary care", "Symptomatic treatment", "Isolation"],
            severity=8
        ),
        HealthCondition(
            name="Mastitis",
            risk_level="medium",
            symptoms=["Swollen udder", "Reduced milk quality", "Heat in udder"],
            precautions=["Clean milking equipment", "Proper milking technique", "Dry cow therapy"],
            treatments=["Antibiotic therapy", "Frequent milking", "Cold compress"],
            severity=6
        ),
        HealthCondition(
            name="Tick Infestation",
            risk_level="low",
            symptoms=["Visible ticks", "Skin irritation", "Reduced feed intake"],
            precautions=["Regular inspection", "Use tick repellent", "Clean surroundings"],
            treatments=["Tick removal", "Antiseptic application", "Antihistamines if needed"],
            severity=3
        )
    ]
    
    @classmethod
    def get_random_breed(cls) -> Dict[str, Any]:
        return random.choice(cls.breeds)
    
    @classmethod
    def get_health_conditions(cls) -> List[HealthCondition]:
        return random.sample(cls.health_conditions, random.randint(0, 2))

class VoiceManager:
    """Manages voice recognition and text-to-speech"""
    
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        self.tts_engine = pyttsx3.init()
        self.is_listening = False
        
    def listen_for_command(self, callback, language="en-IN"):
        """Listen for voice commands"""
        def listen_thread():
            try:
                with self.microphone as source:
                    self.recognizer.adjust_for_ambient_noise(source)
                
                with self.microphone as source:
                    audio = self.recognizer.listen(source, timeout=5)
                
                command = self.recognizer.recognize_google(audio, language=language)
                callback(command)
            except sr.RequestError:
                callback("Error: Could not request results from speech service")
            except sr.Timeout:
                callback("Error: Listening timeout")
            except sr.UnknownValueError:
                callback("Error: Could not understand audio")
            finally:
                self.is_listening = False
        
        self.is_listening = True
        thread = threading.Thread(target=listen_thread)
        thread.daemon = True
        thread.start()
    
    def speak(self, text: str):
        """Convert text to speech"""
        def speak_thread():
            self.tts_engine.say(text)
            self.tts_engine.runAndWait()
        
        thread = threading.Thread(target=speak_thread)
        thread.daemon = True
        thread.start()

class BreedSightApp:
    """Main application class"""
    
    def __init__(self):
        self.root = ctk.CTk()
        self.root.title("BreedSight AI")
        self.root.geometry("400x700")
        self.root.resizable(False, False)
        
        # Initialize managers
        self.language_manager = LanguageManager()
        self.voice_manager = VoiceManager()
        
        # Application state
        self.current_screen = Screen.HOME
        self.selected_image_path: Optional[str] = None
        self.detection_result: Optional[BreedDetectionResult] = None
        self.health_conditions: List[HealthCondition] = []
        self.is_analyzing = False
        
        # UI setup
        self.setup_ui()
        self.show_screen(Screen.HOME)
    
    def setup_ui(self):
        """Initialize the UI"""
        # Create main container
        self.main_frame = ctk.CTkFrame(self.root)
        self.main_frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        # Create screens
        self.create_screens()
    
    def create_screens(self):
        """Create all screen frames"""
        self.screens = {}
        
        # Home Screen
        self.screens[Screen.HOME] = self.create_home_screen()
        
        # Voice Input Screen
        self.screens[Screen.VOICE] = self.create_voice_screen()
        
        # Upload Screen
        self.screens[Screen.UPLOAD] = self.create_upload_screen()
        
        # Detection Screen
        self.screens[Screen.DETECTION] = self.create_detection_screen()
        
        # Health Report Screen
        self.screens[Screen.HEALTH] = self.create_health_screen()
        
        # Milk Yield Screen
        self.screens[Screen.MILK_YIELD] = self.create_milk_yield_screen()
        
        # Breed Info Screen
        self.screens[Screen.BREED_INFO] = self.create_breed_info_screen()
    
    def create_home_screen(self) -> ctk.CTkFrame:
        """Create the home screen"""
        frame = ctk.CTkFrame(self.main_frame)
        
        # Logo and title
        title_frame = ctk.CTkFrame(frame, fg_color="transparent")
        title_frame.pack(pady=20)
        
        # App logo (simple icon)
        logo_label = ctk.CTkLabel(
            title_frame, 
            text="👁️", 
            font=ctk.CTkFont(size=60)
        )
        logo_label.pack()
        
        # App name
        app_name = ctk.CTkLabel(
            title_frame,
            text=self.language_manager.t("app_name"),
            font=ctk.CTkFont(size=28, weight="bold")
        )
        app_name.pack(pady=5)
        
        # Tagline
        tagline = ctk.CTkLabel(
            title_frame,
            text=self.language_manager.t("app_tagline"),
            font=ctk.CTkFont(size=12),
            wraplength=300
        )
        tagline.pack(pady=5)
        
        # Language selector
        lang_frame = ctk.CTkFrame(frame, fg_color="transparent")
        lang_frame.pack(pady=10)
        
        lang_label = ctk.CTkLabel(
            lang_frame,
            text=self.language_manager.t("language") + ":",
            font=ctk.CTkFont(size=12)
        )
        lang_label.pack()
        
        self.language_combo = ctk.CTkComboBox(
            lang_frame,
            values=["English", "हिंदी", "मराठी"],
            command=self.change_language,
            width=150
        )
        self.language_combo.pack(pady=5)
        self.language_combo.set("English")
        
        # Main buttons
        button_frame = ctk.CTkFrame(frame, fg_color="transparent")
        button_frame.pack(pady=20, fill="x", padx=20)
        
        # Take Photo button
        self.take_photo_btn = ctk.CTkButton(
            button_frame,
            text=self.language_manager.t("take_photo"),
            font=ctk.CTkFont(size=16, weight="bold"),
            height=60,
            fg_color=("#FF6B6B", "#EE5A24"),
            hover_color=("#FF5252", "#E53E3E"),
            command=lambda: self.show_screen(Screen.UPLOAD)
        )
        self.take_photo_btn.pack(pady=10, fill="x")
        
        # Voice Input button
        self.voice_input_btn = ctk.CTkButton(
            button_frame,
            text=self.language_manager.t("voice_input"),
            font=ctk.CTkFont(size=16, weight="bold"),
            height=60,
            fg_color=("#4834D4", "#686DE0"),
            hover_color=("#3742FA", "#5F27CD"),
            command=lambda: self.show_screen(Screen.VOICE)
        )
        self.voice_input_btn.pack(pady=10, fill="x")
        
        # Instructions
        instructions_frame = ctk.CTkFrame(frame)
        instructions_frame.pack(pady=20, fill="x", padx=20)
        
        instructions_title = ctk.CTkLabel(
            instructions_frame,
            text="How to use:",
            font=ctk.CTkFont(size=16, weight="bold")
        )
        instructions_title.pack(pady=10)
        
        instructions = [
            "📸 Take a clear photo of your cattle/buffalo",
            "🎙 Use voice commands in your language",
            "📊 Get instant breed identification & health analysis"
        ]
        
        for instruction in instructions:
            inst_label = ctk.CTkLabel(
                instructions_frame,
                text=instruction,
                font=ctk.CTkFont(size=12),
                wraplength=300
            )
            inst_label.pack(pady=2)
        
        return frame
    
    def create_voice_screen(self) -> ctk.CTkFrame:
        """Create the voice input screen"""
        frame = ctk.CTkFrame(self.main_frame)
        
        # Header
        header_frame = ctk.CTkFrame(frame, fg_color="transparent")
        header_frame.pack(pady=20, fill="x", padx=20)
        
        back_btn = ctk.CTkButton(
            header_frame,
            text="← " + self.language_manager.t("back"),
            command=lambda: self.show_screen(Screen.HOME),
            width=100
        )
        back_btn.pack(side="left")
        
        title = ctk.CTkLabel(
            header_frame,
            text=self.language_manager.t("voice_input"),
            font=ctk.CTkFont(size=20, weight="bold")
        )
        title.pack(side="right")
        
        # Voice controls
        voice_frame = ctk.CTkFrame(frame)
        voice_frame.pack(pady=20, fill="x", padx=20)
        
        # Listen button
        self.listen_btn = ctk.CTkButton(
            voice_frame,
            text="🎙 Start Listening",
            font=ctk.CTkFont(size=16, weight="bold"),
            height=50,
            command=self.start_listening
        )
        self.listen_btn.pack(pady=10)
        
        # Transcript display
        self.transcript_text = ctk.CTkTextbox(
            voice_frame,
            height=100,
            wrap="word"
        )
        self.transcript_text.pack(pady=10, fill="x")
        
        # Speak button
        self.speak_btn = ctk.CTkButton(
            voice_frame,
            text="🔊 Speak",
            command=self.speak_transcript,
            state="disabled"
        )
        self.speak_btn.pack(pady=5)
        
        # Voice commands help
        help_frame = ctk.CTkFrame(frame)
        help_frame.pack(pady=20, fill="x", padx=20)
        
        help_title = ctk.CTkLabel(
            help_frame,
            text="Available Voice Commands:",
            font=ctk.CTkFont(size=14, weight="bold")
        )
        help_title.pack(pady=10)
        
        commands = [
            '"Take photo" or "Upload image"',
            '"Health report"',
            '"Milk yield"',
            '"Go back" or "Home"'
        ]
        
        for cmd in commands:
            cmd_label = ctk.CTkLabel(
                help_frame,
                text=f"• {cmd}",
                font=ctk.CTkFont(size=11)
            )
            cmd_label.pack(anchor="w", padx=20)
        
        return frame
    
    def create_upload_screen(self) -> ctk.CTkFrame:
        """Create the image upload screen"""
        frame = ctk.CTkFrame(self.main_frame)
        
        # Header
        header_frame = ctk.CTkFrame(frame, fg_color="transparent")
        header_frame.pack(pady=20, fill="x", padx=20)
        
        back_btn = ctk.CTkButton(
            header_frame,
            text="← " + self.language_manager.t("back"),
            command=lambda: self.show_screen(Screen.HOME),
            width=100
        )
        back_btn.pack(side="left")
        
        title = ctk.CTkLabel(
            header_frame,
            text="Upload Photo",
            font=ctk.CTkFont(size=20, weight="bold")
        )
        title.pack(side="right")
        
        # Upload area
        upload_frame = ctk.CTkFrame(frame)
        upload_frame.pack(pady=20, fill="both", expand=True, padx=20)
        
        # Image display
        self.image_label = ctk.CTkLabel(
            upload_frame,
            text="No image selected",
            width=300,
            height=200,
            fg_color="gray20"
        )
        self.image_label.pack(pady=20)
        
        # Upload button
        upload_btn = ctk.CTkButton(
            upload_frame,
            text="📁 Select Image",
            font=ctk.CTkFont(size=16, weight="bold"),
            height=40,
            command=self.select_image
        )
        upload_btn.pack(pady=10)
        
        # Analyze button
        self.analyze_btn = ctk.CTkButton(
            upload_frame,
            text=self.language_manager.t("analyze_breed"),
            font=ctk.CTkFont(size=16, weight="bold"),
            height=40,
            state="disabled",
            command=self.analyze_image
        )
        self.analyze_btn.pack(pady=10)
        
        # Clear button
        self.clear_btn = ctk.CTkButton(
            upload_frame,
            text="Clear Image",
            command=self.clear_image,
            state="disabled"
        )
        self.clear_btn.pack(pady=5)
        
        return frame
    
    def create_detection_screen(self) -> ctk.CTkFrame:
        """Create the breed detection results screen"""
        frame = ctk.CTkFrame(self.main_frame)
        
        # Header
        header_frame = ctk.CTkFrame(frame, fg_color="transparent")
        header_frame.pack(pady=20, fill="x", padx=20)
        
        back_btn = ctk.CTkButton(
            header_frame,
            text="← " + self.language_manager.t("back"),
            command=lambda: self.show_screen(Screen.HOME),
            width=100
        )
        back_btn.pack(side="left")
        
        title = ctk.CTkLabel(
            header_frame,
            text=self.language_manager.t("breed_detected"),
            font=ctk.CTkFont(size=18, weight="bold")
        )
        title.pack(side="right")
        
        # Results display
        self.results_frame = ctk.CTkFrame(frame)
        self.results_frame.pack(pady=20, fill="both", expand=True, padx=20)
        
        # Action buttons
        actions_frame = ctk.CTkFrame(frame, fg_color="transparent")
        actions_frame.pack(pady=20, fill="x", padx=20)
        
        health_btn = ctk.CTkButton(
            actions_frame,
            text="🏥 " + self.language_manager.t("health_report"),
            font=ctk.CTkFont(size=14, weight="bold"),
            height=45,
            fg_color="#E74C3C",
            command=lambda: self.show_screen(Screen.HEALTH)
        )
        health_btn.pack(pady=5, fill="x")
        
        milk_btn = ctk.CTkButton(
            actions_frame,
            text="🥛 " + self.language_manager.t("milk_yield"),
            font=ctk.CTkFont(size=14, weight="bold"),
            height=45,
            fg_color="#3498DB",
            command=lambda: self.show_screen(Screen.MILK_YIELD)
        )
        milk_btn.pack(pady=5, fill="x")
        
        info_btn = ctk.CTkButton(
            actions_frame,
            text="📊 " + self.language_manager.t("breed_info"),
            font=ctk.CTkFont(size=14, weight="bold"),
            height=45,
            fg_color="#27AE60",
            command=lambda: self.show_screen(Screen.BREED_INFO)
        )
        info_btn.pack(pady=5, fill="x")
        
        return frame
    
    def create_health_screen(self) -> ctk.CTkFrame:
        """Create the health report screen"""
        frame = ctk.CTkFrame(self.main_frame)
        
        # Header
        header_frame = ctk.CTkFrame(frame, fg_color="transparent")
        header_frame.pack(pady=20, fill="x", padx=20)
        
        back_btn = ctk.CTkButton(
            header_frame,
            text="← " + self.language_manager.t("back"),
            command=lambda: self.show_screen(Screen.DETECTION),
            width=100
        )
        back_btn.pack(side="left")
        
        title = ctk.CTkLabel(
            header_frame,
            text=self.language_manager.t("health_report"),
            font=ctk.CTkFont(size=18, weight="bold")
        )
        title.pack(side="right")
        
        speak_btn = ctk.CTkButton(
            header_frame,
            text="🔊",
            width=40,
            command=self.speak_health_report
        )
        speak_btn.pack(side="right", padx=10)
        
        # Health results
        self.health_results_frame = ctk.CTkScrollableFrame(frame)
        self.health_results_frame.pack(pady=20, fill="both", expand=True, padx=20)
        
        return frame
    
    def create_milk_yield_screen(self) -> ctk.CTkFrame:
        """Create the milk yield analysis screen"""
        frame = ctk.CTkFrame(self.main_frame)
        
        # Header
        header_frame = ctk.CTkFrame(frame, fg_color="transparent")
        header_frame.pack(pady=20, fill="x", padx=20)
        
        back_btn = ctk.CTkButton(
            header_frame,
            text="← " + self.language_manager.t("back"),
            command=lambda: self.show_screen(Screen.DETECTION),
            width=100
        )
        back_btn.pack(side="left")
        
        title = ctk.CTkLabel(
            header_frame,
            text=self.language_manager.t("milk_yield"),
            font=ctk.CTkFont(size=18, weight="bold")
        )
        title.pack(side="right")
        
        # Input form
        input_frame = ctk.CTkFrame(frame)
        input_frame.pack(pady=20, fill="x", padx=20)
        
        # Milk quantity input
        qty_label = ctk.CTkLabel(
            input_frame,
            text=self.language_manager.t("milk_quantity"),
            font=ctk.CTkFont(size=12)
        )
        qty_label.pack(pady=5)
        
        self.milk_qty_entry = ctk.CTkEntry(
            input_frame,
            placeholder_text="Enter daily milk quantity",
            width=200
        )
        self.milk_qty_entry.pack(pady=5)
        
        # Feed type selection
        feed_label = ctk.CTkLabel(
            input_frame,
            text=self.language_manager.t("feed_type"),
            font=ctk.CTkFont(size=12)
        )
        feed_label.pack(pady=5)
        
        self.feed_combo = ctk.CTkComboBox(
            input_frame,
            values=[
                self.language_manager.t("grass"),
                self.language_manager.t("silage"),
                self.language_manager.t("mixed")
            ],
            width=200
        )
        self.feed_combo.pack(pady=5)
        
        # Analyze button
        analyze_milk_btn = ctk.CTkButton(
            input_frame,
            text="Analyze Milk Yield",
            command=self.analyze_milk_yield
        )
        analyze_milk_btn.pack(pady=10)
        
        # Results
        self.milk_results_frame = ctk.CTkScrollableFrame(frame)
        self.milk_results_frame.pack(pady=20, fill="both", expand=True, padx=20)
        
        return frame
    
    def create_breed_info_screen(self) -> ctk.CTkFrame:
        """Create the breed information screen"""
        frame = ctk.CTkFrame(self.main_frame)
        
        # Header
        header_frame = ctk.CTkFrame(frame, fg_color="transparent")
        header_frame.pack(pady=20, fill="x", padx=20)
        
        back_btn = ctk.CTkButton(
            header_frame,
            text="← " + self.language_manager.t("back"),
            command=lambda: self.show_screen(Screen.DETECTION),
            width=100
        )
        back_btn.pack(side="left")
        
        title = ctk.CTkLabel(
            header_frame,
            text=self.language_manager.t("breed_info"),
            font=ctk.CTkFont(size=18, weight="bold")
        )
        title.pack(side="right")
        
        # Breed information
        self.breed_info_frame = ctk.CTkScrollableFrame(frame)
        self.breed_info_frame.pack(pady=20, fill="both", expand=True, padx=20)
        
        return frame
    
    def show_screen(self, screen: Screen):
        """Show the specified screen"""
        # Hide all screens
        for s in self.screens.values():
            s.pack_forget()
        
        # Show selected screen
        self.screens[screen].pack(fill="both", expand=True)
        self.current_screen = screen
        
        # Update screen content based on current state
        self.update_screen_content(screen)
    
    def update_screen_content(self, screen: Screen):
        """Update the content of the current screen"""
        if screen == Screen.DETECTION and self.detection_result:
            self.update_detection_results()
        elif screen == Screen.HEALTH:
            self.update_health_results()
        elif screen == Screen.BREED_INFO and self.detection_result:
            self.update_breed_info()
    
    def change_language(self, selection: str):
        """Change the application language"""
        language_map = {
            "English": Language.EN,
            "हिंदी": Language.HI,
            "मराठी": Language.MR
        }
        
        if selection in language_map:
            self.language_manager.set_language(language_map[selection])
            self.refresh_ui_text()
    
    def refresh_ui_text(self):
        """Refresh all UI text with current language"""
        # This would update all text elements - simplified for demo
        messagebox.showinfo("Language Changed", f"Language changed to {self.language_manager.current_language.value}")
    
    def select_image(self):
        """Open file dialog to select an image"""
        file_path = filedialog.askopenfilename(
            title="Select Image",
            filetypes=[
                ("Image files", "*.jpg *.jpeg *.png *.bmp *.gif"),
                ("All files", "*.*")
            ]
        )
        
        if file_path:
            self.selected_image_path = file_path
            self.display_selected_image()
            self.analyze_btn.configure(state="normal")
            self.clear_btn.configure(state="normal")
    
    def display_selected_image(self):
        """Display the selected image"""
        if self.selected_image_path:
            try:
                # Load and resize image
                image = Image.open(self.selected_image_path)
                image = image.resize((300, 200), Image.Resampling.LANCZOS)
                
                # Convert to PhotoImage
                photo = ImageTk.PhotoImage(image)
                
                # Update label
                self.image_label.configure(image=photo, text="")
                self.image_label.image = photo  # Keep a reference
                
            except Exception as e:
                messagebox.showerror("Error", f"Could not load image: {str(e)}")
    
    def clear_image(self):
        """Clear the selected image"""
        self.selected_image_path = None
        self.image_label.configure(image="", text="No image selected")
        self.analyze_btn.configure(state="disabled")
        self.clear_btn.configure(state="disabled")
    
    def analyze_image(self):
        """Analyze the selected image for breed detection"""
        if not self.selected_image_path:
            messagebox.showwarning("Warning", "Please select an image first")
            return
        
        self.is_analyzing = True
        self.analyze_btn.configure(text="Analyzing...", state="disabled")
        
        def analyze_thread():
            # Simulate AI processing delay
            time.sleep(2)
            
            # Generate mock results
            breed_data = BreedDatabase.get_random_breed()
            
            self.detection_result = BreedDetectionResult(
                breed_name=breed_data["breed_name"],
                confidence=breed_data["confidence"],
                type=breed_data["type"],
                age_estimate=f"{2 + random.randint(0, 6)} years",
                weight_estimate=f"{300 + random.randint(0, 200) if breed_data['type'] == 'cattle' else 400 + random.randint(0, 300)} kg",
                characteristics=breed_data["characteristics"]
            )
            
            # Generate health conditions
            self.health_conditions = BreedDatabase.get_health_conditions()
            
            self.is_analyzing = False
            
            # Update UI in main thread
            self.root.after(0, lambda: [
                self.analyze_btn.configure(text=self.language_manager.t("analyze_breed"), state="normal"),
                self.show_screen(Screen.DETECTION)
            ])
        
        # Start analysis in background thread
        thread = threading.Thread(target=analyze_thread)
        thread.daemon = True
        thread.start()
    
    def update_detection_results(self):
        """Update the detection results display"""
        if not self.detection_result:
            return
        
        # Clear previous results
        for widget in self.results_frame.winfo_children():
            widget.destroy()
        
        # Display image with bounding box effect
        if self.selected_image_path:
            try:
                image = Image.open(self.selected_image_path)
                image = image.resize((280, 180), Image.Resampling.LANCZOS)
                
                # Add bounding box effect
                draw = ImageDraw.Draw(image)
                draw.rectangle([10, 10, 270, 170], outline="green", width=3)
                
                photo = ImageTk.PhotoImage(image)
                img_label = ctk.CTkLabel(self.results_frame, image=photo, text="")
                img_label.image = photo
                img_label.pack(pady=10)
            except Exception as e:
                print(f"Error displaying image: {e}")
        
        # Breed name and confidence
        breed_label = ctk.CTkLabel(
            self.results_frame,
            text=f"{self.detection_result.breed_name}",
            font=ctk.CTkFont(size=20, weight="bold")
        )
        breed_label.pack(pady=5)
        
        confidence_label = ctk.CTkLabel(
            self.results_frame,
            text=f"{self.language_manager.t('confidence')}: {self.detection_result.confidence:.0%}",
            font=ctk.CTkFont(size=14)
        )
        confidence_label.pack(pady=2)
        
        # Age and weight estimates
        estimates_frame = ctk.CTkFrame(self.results_frame, fg_color="transparent")
        estimates_frame.pack(pady=10, fill="x")
        
        age_frame = ctk.CTkFrame(estimates_frame)
        age_frame.pack(side="left", padx=5, fill="x", expand=True)
        
        age_title = ctk.CTkLabel(age_frame, text=self.language_manager.t("age_estimate"), font=ctk.CTkFont(size=10))
        age_title.pack()
        age_value = ctk.CTkLabel(age_frame, text=self.detection_result.age_estimate, font=ctk.CTkFont(size=16, weight="bold"))
        age_value.pack()
        
        weight_frame = ctk.CTkFrame(estimates_frame)
        weight_frame.pack(side="right", padx=5, fill="x", expand=True)
        
        weight_title = ctk.CTkLabel(weight_frame, text=self.language_manager.t("weight_estimate"), font=ctk.CTkFont(size=10))
        weight_title.pack()
        weight_value = ctk.CTkLabel(weight_frame, text=self.detection_result.weight_estimate, font=ctk.CTkFont(size=16, weight="bold"))
        weight_value.pack()
    
    def update_health_results(self):
        """Update the health results display"""
        # Clear previous results
        for widget in self.health_results_frame.winfo_children():
            widget.destroy()
        
        if not self.health_conditions:
            no_issues = ctk.CTkLabel(
                self.health_results_frame,
                text="🛡️ Excellent Health\nNo health issues detected",
                font=ctk.CTkFont(size=16, weight="bold"),
                fg_color="green"
            )
            no_issues.pack(pady=20, fill="x")
            return
        
        for condition in self.health_conditions:
            # Condition frame
            condition_frame = ctk.CTkFrame(self.health_results_frame)
            condition_frame.pack(pady=10, fill="x")
            
            # Header with name and risk level
            header_frame = ctk.CTkFrame(condition_frame, fg_color="transparent")
            header_frame.pack(fill="x", padx=10, pady=5)
            
            name_label = ctk.CTkLabel(
                header_frame,
                text=condition.name,
                font=ctk.CTkFont(size=14, weight="bold")
            )
            name_label.pack(side="left")
            
            risk_color = {"low": "green", "medium": "orange", "high": "red"}
            risk_label = ctk.CTkLabel(
                header_frame,
                text=f"{self.language_manager.t('risk_level')}: {self.language_manager.t(condition.risk_level)}",
                fg_color=risk_color.get(condition.risk_level, "gray")
            )
            risk_label.pack(side="right")
            
            # Symptoms
            if condition.symptoms:
                symptoms_label = ctk.CTkLabel(
                    condition_frame,
                    text=f"Symptoms: {', '.join(condition.symptoms)}",
                    font=ctk.CTkFont(size=10),
                    wraplength=300
                )
                symptoms_label.pack(anchor="w", padx=10, pady=2)
            
            # Precautions
            if condition.precautions:
                precautions_label = ctk.CTkLabel(
                    condition_frame,
                    text=f"{self.language_manager.t('precautions')}: {', '.join(condition.precautions)}",
                    font=ctk.CTkFont(size=10),
                    wraplength=300
                )
                precautions_label.pack(anchor="w", padx=10, pady=2)
            
            # Treatments
            if condition.treatments:
                treatments_label = ctk.CTkLabel(
                    condition_frame,
                    text=f"{self.language_manager.t('treatment')}: {', '.join(condition.treatments)}",
                    font=ctk.CTkFont(size=10),
                    wraplength=300
                )
                treatments_label.pack(anchor="w", padx=10, pady=2)
    
    def update_breed_info(self):
        """Update the breed information display"""
        if not self.detection_result:
            return
        
        # Clear previous content
        for widget in self.breed_info_frame.winfo_children():
            widget.destroy()
        
        # Breed name
        breed_title = ctk.CTkLabel(
            self.breed_info_frame,
            text=self.detection_result.breed_name,
            font=ctk.CTkFont(size=18, weight="bold")
        )
        breed_title.pack(pady=10)
        
        # Ideal climate
        climate_frame = ctk.CTkFrame(self.breed_info_frame)
        climate_frame.pack(pady=10, fill="x")
        
        climate_title = ctk.CTkLabel(
            climate_frame,
            text=self.language_manager.t("ideal_climate"),
            font=ctk.CTkFont(size=12, weight="bold")
        )
        climate_title.pack(anchor="w", padx=10, pady=5)
        
        climate_desc = ctk.CTkLabel(
            climate_frame,
            text="Tropical to subtropical climate with temperatures between 15-35°C",
            font=ctk.CTkFont(size=10),
            wraplength=300
        )
        climate_desc.pack(anchor="w", padx=10, pady=2)
        
        # Common diseases
        diseases_frame = ctk.CTkFrame(self.breed_info_frame)
        diseases_frame.pack(pady=10, fill="x")
        
        diseases_title = ctk.CTkLabel(
            diseases_frame,
            text=self.language_manager.t("common_diseases"),
            font=ctk.CTkFont(size=12, weight="bold")
        )
        diseases_title.pack(anchor="w", padx=10, pady=5)
        
        diseases = ["• Foot and Mouth Disease", "• Mastitis", "• Tick-borne diseases"]
        for disease in diseases:
            disease_label = ctk.CTkLabel(
                diseases_frame,
                text=disease,
                font=ctk.CTkFont(size=10)
            )
            disease_label.pack(anchor="w", padx=20, pady=1)
        
        # Preventive care
        care_frame = ctk.CTkFrame(self.breed_info_frame)
        care_frame.pack(pady=10, fill="x")
        
        care_title = ctk.CTkLabel(
            care_frame,
            text=self.language_manager.t("preventive_care"),
            font=ctk.CTkFont(size=12, weight="bold")
        )
        care_title.pack(anchor="w", padx=10, pady=5)
        
        care_tips = [
            "• Regular vaccination schedule",
            "• Clean housing and feeding areas", 
            "• Balanced nutrition",
            "• Regular health checkups"
        ]
        for tip in care_tips:
            tip_label = ctk.CTkLabel(
                care_frame,
                text=tip,
                font=ctk.CTkFont(size=10)
            )
            tip_label.pack(anchor="w", padx=20, pady=1)
    
    def analyze_milk_yield(self):
        """Analyze milk yield based on input"""
        try:
            milk_qty = float(self.milk_qty_entry.get())
            feed_type = self.feed_combo.get()
            
            if not milk_qty or not feed_type:
                messagebox.showwarning("Warning", "Please fill all fields")
                return
            
            # Clear previous results
            for widget in self.milk_results_frame.winfo_children():
                widget.destroy()
            
            # Generate analysis
            breed_name = self.detection_result.breed_name if self.detection_result else "Unknown"
            
            # Expected yield ranges (mock data)
            expected_ranges = {
                "Gir": (6, 10),
                "Sahiwal": (8, 12),
                "Red Sindhi": (5, 8),
                "Murrah Buffalo": (8, 15),
                "Surti Buffalo": (4, 8)
            }
            
            expected_min, expected_max = expected_ranges.get(breed_name, (5, 10))
            is_low_yield = milk_qty < expected_min
            
            # Display results
            results_title = ctk.CTkLabel(
                self.milk_results_frame,
                text="Milk Yield Analysis",
                font=ctk.CTkFont(size=16, weight="bold")
            )
            results_title.pack(pady=10)
            
            # Current vs Expected
            comparison_frame = ctk.CTkFrame(self.milk_results_frame, fg_color="transparent")
            comparison_frame.pack(pady=10, fill="x")
            
            current_frame = ctk.CTkFrame(comparison_frame)
            current_frame.pack(side="left", padx=5, fill="x", expand=True)
            
            current_title = ctk.CTkLabel(current_frame, text="Current", font=ctk.CTkFont(size=10))
            current_title.pack()
            current_value = ctk.CTkLabel(current_frame, text=f"{milk_qty}L", font=ctk.CTkFont(size=16, weight="bold"))
            current_value.pack()
            
            expected_frame = ctk.CTkFrame(comparison_frame)
            expected_frame.pack(side="right", padx=5, fill="x", expand=True)
            
            expected_title = ctk.CTkLabel(expected_frame, text="Expected", font=ctk.CTkFont(size=10))
            expected_title.pack()
            expected_value = ctk.CTkLabel(expected_frame, text=f"{expected_min}-{expected_max}L", font=ctk.CTkFont(size=14, weight="bold"))
            expected_value.pack()
            
            # Status
            status_color = "red" if is_low_yield else "green"
            status_text = "Below Expected" if is_low_yield else "Normal Range"
            status_label = ctk.CTkLabel(
                self.milk_results_frame,
                text=status_text,
                fg_color=status_color,
                font=ctk.CTkFont(size=14, weight="bold")
            )
            status_label.pack(pady=10)
            
            # Recommendations
            recommendations_frame = ctk.CTkFrame(self.milk_results_frame)
            recommendations_frame.pack(pady=10, fill="x")
            
            rec_title = ctk.CTkLabel(
                recommendations_frame,
                text=self.language_manager.t("suggestions"),
                font=ctk.CTkFont(size=12, weight="bold")
            )
            rec_title.pack(pady=5)
            
            if is_low_yield:
                recommendations = [
                    "• Increase protein content in feed",
                    "• Check for health issues",
                    "• Ensure adequate rest periods",
                    "• Monitor water intake"
                ]
            else:
                recommendations = [
                    "• Maintain current feeding schedule", 
                    "• Monitor for any changes",
                    "• Regular health checkups"
                ]
            
            for rec in recommendations:
                rec_label = ctk.CTkLabel(
                    recommendations_frame,
                    text=rec,
                    font=ctk.CTkFont(size=10)
                )
                rec_label.pack(anchor="w", padx=10, pady=1)
            
        except ValueError:
            messagebox.showerror("Error", "Please enter a valid number for milk quantity")
    
    def start_listening(self):
        """Start voice recognition"""
        if self.voice_manager.is_listening:
            return
        
        self.listen_btn.configure(text="🎙 Listening...", state="disabled")
        self.transcript_text.delete("1.0", "end")
        
        def on_result(result):
            self.root.after(0, lambda: [
                self.transcript_text.insert("1.0", result),
                self.listen_btn.configure(text="🎙 Start Listening", state="normal"),
                self.speak_btn.configure(state="normal"),
                self.process_voice_command(result)
            ])
        
        # Get language code for speech recognition
        lang_codes = {
            Language.EN: "en-IN",
            Language.HI: "hi-IN", 
            Language.MR: "mr-IN"
        }
        lang_code = lang_codes.get(self.language_manager.current_language, "en-IN")
        
        self.voice_manager.listen_for_command(on_result, lang_code)
    
    def speak_transcript(self):
        """Speak the transcript text"""
        text = self.transcript_text.get("1.0", "end").strip()
        if text:
            self.voice_manager.speak(text)
    
    def speak_health_report(self):
        """Speak the health report"""
        if not self.health_conditions:
            self.voice_manager.speak("Excellent health. No health issues detected.")
            return
        
        report_text = "Health Report: "
        for condition in self.health_conditions:
            report_text += f"{condition.name} - {condition.risk_level} risk. "
            report_text += f"Precautions: {', '.join(condition.precautions)}. "
        
        self.voice_manager.speak(report_text)
    
    def process_voice_command(self, command: str):
        """Process voice commands"""
        command_lower = command.lower()
        
        if "take photo" in command_lower or "upload" in command_lower:
            self.show_screen(Screen.UPLOAD)
        elif "health" in command_lower:
            if self.detection_result:
                self.show_screen(Screen.HEALTH)
        elif "milk" in command_lower:
            if self.detection_result:
                self.show_screen(Screen.MILK_YIELD)
        elif "home" in command_lower or "back" in command_lower:
            self.show_screen(Screen.HOME)
    
    def run(self):
        """Start the application"""
        self.root.mainloop()

def main():
    """Main entry point"""
    app = BreedSightApp()
    app.run()

if __name__ == "__main__":
    main()
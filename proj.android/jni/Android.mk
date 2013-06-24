LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_CPPFLAGS+= -fexceptions

LOCAL_MODULE := game_shared

LOCAL_MODULE_FILENAME := libgame

LOCAL_SRC_FILES :=  hellocpp/main.cpp \
        ../../Classes/AppDelegate.cpp

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../Classes
    
LOCAL_WHOLE_STATIC_LIBRARIES := cqwrap_static
LOCAL_SHARED_LIBRARIES += libwebsockets_shared

include $(BUILD_SHARED_LIBRARY)

$(call import-module,external/cqwrap)

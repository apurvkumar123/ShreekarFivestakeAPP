//
//  RCTDeviceInfoModule.m
//  CharityApp
//
//  Created by Apurv Modi on 19/04/23.
//

#import <React/RCTLog.h>
#import <Foundation/Foundation.h>
#import "ReactNativeDeviceInfoModule.h"
@implementation ReactNativeDeviceInfoModule

// To export a module named ReactNativeDeviceInfoModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(DeviceInfoProcess:(NSString *)name:(RCTPromiseResolveBlock )resolve reject:(RCTPromiseRejectBlock )reject)
{
  RCTLogInfo(@"Pretending to create an event %@", name);
  NSLog(@"Pretending to create an event %@", name);
  UIDevice *deviceInfo = [UIDevice currentDevice];
  NSLog(@"Device name:  %@", deviceInfo.name);
  
  NSString *eventName;

  if ([name isEqual:@"ModelName"]) {
    eventName = deviceInfo.name;
  } else if ([name isEqual:@"AppVersion"]) {
    eventName = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
    
  } else if ([name isEqual:@"AppCode"]) {
    eventName = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleVersion"];
    
  }else if ([name isEqual:@"PackageName"]) {
    eventName = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleIdentifier"];
    
  } else {
    eventName = @"Unknown";
  }
  
  resolve(eventName);

}

@end

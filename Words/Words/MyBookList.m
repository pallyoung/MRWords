//
//  MyBookList.m
//  Words
//
//  Created by YeSpencer on 1/14/16.
//  Copyright © 2016 YeSpencer. All rights reserved.
//

#import "MyBookList.h"
@interface MyBookList()
@property (strong, nonatomic) NSMutableArray *bookList;
@end

static NSString * const STOREDKEY  = @"books";

@implementation MyBookList

+ (instancetype)sharedBookList {
    static MyBookList *shared = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        shared = [[self alloc] init];
    });
    return shared;
}
- (long) count{
    return [_bookList count];
}
- (NSString *) getBookByIndex:(long)count{
    return [_bookList objectAtIndex:count];
}
- (instancetype)init {
    self = [super init];
    if (self) {
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        NSArray *storedList = [defaults objectForKey:STOREDKEY];
        if (storedList) {
            self.bookList = [storedList mutableCopy];
        } else {
            self.bookList = [NSMutableArray array];
        }
    }
    return self;
}
- (void)addBook:(NSString *)item{
    [_bookList insertObject:item atIndex:0];
    [self saveBooks];
}
- (void)removeBook:(NSString *)item{
    [_bookList removeObject:item];
    [self saveBooks];
}
-(void)removeBookByIndexs:(NSMutableArray *) indexs{
    for(NSNumber  * index in indexs){
        @try{
            [_bookList removeObjectAtIndex:[index integerValue]];

        }@catch(NSException * e){
            NSLog(e.reason);
        }
    }
    [self saveBooks];
}
- (void)saveBooks {
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults setObject:self.bookList forKey:STOREDKEY];
    [defaults synchronize];
}
@end

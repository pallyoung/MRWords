//
//  MyBookList.h
//  Words
//
//  Created by YeSpencer on 1/14/16.
//  Copyright © 2016 YeSpencer. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface MyBookList : NSObject
+ (instancetype)sharedBookList;
- (NSArray *)bookList;
- (void)addBook:(id)item;
- (void)removeBook:(id)item;
- (void)removeBookByIndexs:(NSMutableArray *) indexs;
- (void)saveBooks;
- (id) getBookByIndex:(long)count;
- (long) count;
@end

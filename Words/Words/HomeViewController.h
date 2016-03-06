//
//  HomeViewController.h
//  Words
//
//  Created by YeSpencer on 1/15/16.
//  Copyright © 2016 YeSpencer. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "AddBookViewController.h"

@interface HomeViewController : UIViewController<UICollectionViewDataSource,UICollectionViewDelegate,UIGestureRecognizerDelegate>
@property (weak, nonatomic) IBOutlet UICollectionView *bookListView;
- (void)cellLongPress:(UILongPressGestureRecognizer *) recognizer;
@property (weak, nonatomic) IBOutlet UIView *editToolBar;
@property (strong,nonatomic) AddBookViewController *addBookViewController;
- (IBAction)goAddBookView:(id)sender;
- (IBAction)removeButtonTap:(id)sender;
- (IBAction)doneButtonTap:(id)sender;
- (void) bookListViewReload;
@end

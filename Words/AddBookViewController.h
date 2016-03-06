//
//  AddBookViewController.h
//  Words
//
//  Created by YeSpencer on 1/21/16.
//  Copyright © 2016 YeSpencer. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface AddBookViewController : UIViewController
@property (weak, nonatomic) IBOutlet UIButton *addBook;
- (IBAction)addBook:(id)sender;
@property (weak, nonatomic) IBOutlet UITextField *name;
- (IBAction)backgroundTap:(id)sender;
- (IBAction)textFieldExit:(id)sender;

@end

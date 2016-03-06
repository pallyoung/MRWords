//
//  AddBookViewController.m
//  Words
//
//  Created by YeSpencer on 1/21/16.
//  Copyright © 2016 YeSpencer. All rights reserved.
//

#import "AddBookViewController.h"
#import "MyBookList.h"
#import "HomeViewController.h"

@interface AddBookViewController ()
@property(weak,nonatomic) MyBookList *myBookList;
@end

@implementation AddBookViewController

- (void)viewDidLoad {
    _myBookList = [MyBookList sharedBookList];
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

- (IBAction)addBook:(id)sender {
    if( [_name.text isEqualToString:@""]){
        [self.view removeFromSuperview];
        return;
    }
    NSDate* dat = [NSDate dateWithTimeIntervalSinceNow:0];
    NSTimeInterval a=[dat timeIntervalSince1970];
    NSString *timeString = [NSString stringWithFormat:@"%f", a];
    NSString *name = [NSString stringWithFormat:@"%@/%@/%@",_name.text,timeString,timeString];
    NSLog(name);
    [_myBookList addBook:name];
    _name.text = @"";
//    [(HomeViewController *)self.parentViewController performSelectorOnMainThread:@selector(bookListViewReload) withObject:nil waitUntilDone:NO];
    [(HomeViewController *)self.parentViewController bookListViewReload];
    [self.view removeFromSuperview];
}
- (IBAction)backgroundTap:(id)sender {
    [_name resignFirstResponder];
}

- (IBAction)textFieldExit:(id)sender {
    [_name resignFirstResponder];
}
@end
